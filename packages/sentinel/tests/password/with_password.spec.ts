import { RuntimeException } from '@adonisjs/core/exceptions'
import type { Hash } from '@adonisjs/core/hash'
import { compose, Secret } from '@adonisjs/core/helpers'
import type { ApplicationService } from '@adonisjs/core/types'
import type { Database } from '@adonisjs/lucid/database'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../../modules/password/errors.ts'
import { PasswordManager } from '../../modules/password/manager.ts'
import type { withPassword as WithPassword } from '../../modules/password/mixins/with_password.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import type { Sentinel } from '../../src/sentinel.ts'
import { createSentinelApp, MemoryTokenProvider } from '../helpers.ts'

const ONE_DAY = 24 * 60 * 60 * 1000

/**
 * Models using the mixin. It is handed over rather than imported
 * because its module resolves the sentinel service from the application
 * booted at import time, see "createSentinelApp".
 */
function defineModels(withPassword: typeof WithPassword) {
  /**
   * Defaults of the mixin, with "reset" as the default token purpose.
   */
  class User extends compose(BaseModel, withPassword({ purpose: 'reset' })) {
    static table = 'users'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string

    @column()
    declare password: string
  }

  /**
   * Same table, the password lives under a different property, users
   * are looked up by two uids and outdated hashes are left alone.
   */
  class Account extends compose(
    BaseModel,
    withPassword({
      passwordColumnName: 'passwordHash',
      uids: ['email', 'username'],
      rehashOnVerify: false,
    })
  ) {
    static table = 'users'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string

    @column()
    declare username: string

    @column({ columnName: 'password' })
    declare passwordHash: string
  }

  return { User, Account }
}

/**
 * Awaits a rejection with an "E_INVALID_TOKEN" error and returns it.
 */
async function invalidToken(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    if (error instanceof E_INVALID_TOKEN) return error
    throw error
  }

  throw new Error('Expected the password reset token to be rejected')
}

/**
 * Awaits a rejection and returns the error.
 */
async function rejection(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    return error
  }

  throw new Error('Expected the promise to be rejected')
}

test.group('withPassword', (group) => {
  let app: ApplicationService
  let db: Database
  let sentinel: Sentinel
  let provider: MemoryTokenProvider
  let weak: Hash
  let User: ReturnType<typeof defineModels>['User']
  let Account: ReturnType<typeof defineModels>['Account']

  group.setup(async () => {
    const context = await createSentinelApp()
    app = context.app
    db = context.db
    provider = context.provider
    sentinel = await app.container.make('sentinel')
    weak = (await app.container.make('hash')).use('weak')

    const { withPassword } = await import('../../modules/password/mixins/with_password.ts')
    ;({ User, Account } = defineModels(withPassword))
  })

  group.each.teardown(async () => {
    provider.tokens = []
    await User.query().delete()
  })

  group.teardown(() => app.terminate())

  test('should hash the password before persisting it', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    assert.notEqual(user.password, 'secret')
    assert.isTrue(await user.verifyPassword('secret'))
    assert.isFalse(await user.verifyPassword('wrong'))
    assert.equal((await User.findOrFail(user.id)).password, user.password)
  })

  test('should hash the password again when it changes', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const hashed = user.password

    user.password = 'new-secret'
    await user.save()

    assert.notEqual(user.password, hashed)
    assert.notEqual(user.password, 'new-secret')
    assert.isTrue(await (await User.findOrFail(user.id)).verifyPassword('new-secret'))
  })

  test('should leave the password alone when it has not changed', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const hashed = user.password

    user.email = 'jane.doe@example.com'
    await user.save()

    assert.equal(user.password, hashed)
    assert.isTrue(await user.verifyPassword('secret'))
  })

  test('should throw when verifying against an empty password', async ({ assert }) => {
    const user = new User()

    await assert.rejects(
      () => user.verifyPassword('secret'),
      RuntimeException,
      'Cannot verify password. The value for "password" column is undefined or null'
    )
  })

  test('should find a model from one of the given uids', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    assert.equal((await User.findForAuth(['email'], 'jane@example.com'))!.id, user.id)
    assert.isNull(await User.findForAuth(['email'], 'john@example.com'))
  })

  test('should verify the credentials of a model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    const found = await User.verifyCredentials('jane@example.com', 'secret')

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })

  test('should look the model up by any of the configured uids', async ({ assert }) => {
    const account = await Account.create({
      email: 'jane@example.com',
      username: 'jane',
      passwordHash: 'secret',
    })

    assert.equal((await Account.verifyCredentials('jane@example.com', 'secret')).id, account.id)
    assert.equal((await Account.verifyCredentials('jane', 'secret')).id, account.id)
  })

  test('should reject wrong credentials')
    .with([
      { uid: 'jane@example.com', password: 'wrong' },
      { uid: 'john@example.com', password: 'secret' },
      { uid: '', password: 'secret' },
      { uid: 'jane@example.com', password: '' },
    ])
    .run(async ({ assert }, { uid, password }) => {
      await User.create({ email: 'jane@example.com', password: 'secret' })

      const error = await rejection(User.verifyCredentials(uid, password))

      assert.instanceOf(error, E_INVALID_CREDENTIALS)
      assert.equal(
        (error as InstanceType<typeof E_INVALID_CREDENTIALS>).code,
        'E_INVALID_CREDENTIALS'
      )
      assert.equal((error as InstanceType<typeof E_INVALID_CREDENTIALS>).status, 400)
      assert.equal((error as Error).message, 'Invalid user credentials')
    })

  test('should hash the password again when the persisted hash is outdated', async ({ assert }) => {
    const outdated = await weak.make('secret')
    await db.table('users').insert({ email: 'jane@example.com', password: outdated })

    const found = await User.verifyCredentials('jane@example.com', 'secret')

    assert.notEqual(found.password, outdated)
    assert.isTrue(await found.verifyPassword('secret'))

    const persisted = await User.findOrFail(found.id)
    assert.notEqual(persisted.password, outdated)
    assert.isTrue(await persisted.verifyPassword('secret'))
    assert.isFalse(sentinel.password.needsRehash(persisted.password))
  })

  test('should keep an outdated hash when rehashing is disabled', async ({ assert }) => {
    const outdated = await weak.make('secret')
    await db.table('users').insert({ email: 'jane@example.com', password: outdated })

    const found = await Account.verifyCredentials('jane@example.com', 'secret')

    assert.equal(found.passwordHash, outdated)
    assert.equal((await Account.findOrFail(found.id)).passwordHash, outdated)
  })

  test('should validate the password of a model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    await user.validatePassword('secret')

    const error: any = await rejection(user.validatePassword('wrong'))
    assert.equal(error.message, 'Validation Error')
    assert.equal(error.code, 'E_VALIDATION_ERROR')
    assert.equal(error.status, 422)
    assert.deepEqual(error.messages, [
      {
        field: 'currentPassword',
        message: 'The current password is incorrect',
        rule: 'current_password',
      },
    ])

    const named: any = await rejection(user.validatePassword('wrong', 'old_password'))
    assert.equal(named.messages[0].field, 'old_password')
  })

  test('should generate a token for the primary key of the model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    const token = await user.generatePasswordResetToken()

    assert.instanceOf(token, Secret)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].tokenableId, user.id)
    assert.equal(provider.tokens[0].kind, PasswordManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].purpose, 'reset')
  })

  test('should override the defaults of the mixin with the given options', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })

    const before = Date.now()
    await user.generatePasswordResetToken({
      purpose: 'invitation',
      metadata: { redirect: '/dashboard' },
      expiresIn: '1d',
    })
    const after = Date.now()

    assert.equal(provider.tokens[0].purpose, 'invitation')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_DAY)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_DAY)
  })

  test('should throw when the primary key is empty', async ({ assert }) => {
    const user = new User()

    await assert.rejects(
      () => user.generatePasswordResetToken(),
      RuntimeException,
      /^Cannot generate a password reset token for User \{.*\}: the primary key is empty$/s
    )
    await assert.rejects(
      () => user.invalidatePasswordResetTokens(),
      RuntimeException,
      /^Cannot invalidate the password reset tokens of User \{.*\}: the primary key is empty$/s
    )
    assert.isEmpty(provider.tokens)
  })

  test('should verify the token and return the model instance', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyPasswordResetToken(token)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'jane@example.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the token as a string', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken()

    const [found, metadata] = await User.verifyPasswordResetToken(token.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(provider.tokens)
  })

  test('should verify the token with the default purpose of the mixin', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken({ purpose: 'invitation' })

    const error = await invalidToken(User.verifyPasswordResetToken(token))
    assert.equal(error.purpose, 'reset')
    assert.lengthOf(provider.tokens, 1)

    const [found] = await User.verifyPasswordResetToken(token, { purpose: 'invitation' })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should drop the default purpose when the purpose option is undefined', async ({
    assert,
  }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken({ purpose: undefined })
    assert.isNull(provider.tokens[0].purpose)

    const error = await invalidToken(User.verifyPasswordResetToken(token))
    assert.equal(error.purpose, 'reset')
    assert.lengthOf(provider.tokens, 1)

    const [found] = await User.verifyPasswordResetToken(token, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should reject an unknown token', async ({ assert }) => {
    const error = await invalidToken(User.verifyPasswordResetToken('unknown-token'))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.equal(error.purpose, 'reset')
  })

  test('should reject the token when the model no longer exists', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken()
    await user.delete()

    const error = await invalidToken(User.verifyPasswordResetToken(token))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.equal(error.purpose, 'reset')
    assert.isEmpty(provider.tokens)
  })

  test('should reset the password and consume the token', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.resetPassword(token, 'new-secret')

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)

    const persisted = await User.findOrFail(user.id)
    assert.notEqual(persisted.password, 'new-secret')
    assert.isTrue(await persisted.verifyPassword('new-secret'))
    assert.isFalse(await persisted.verifyPassword('secret'))
    assert.equal((await User.verifyCredentials('jane@example.com', 'new-secret')).id, user.id)
  })

  test('should reset the password with the default purpose of the mixin', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken({ purpose: 'invitation' })

    const error = await invalidToken(User.resetPassword(token, 'new-secret'))
    assert.equal(error.purpose, 'reset')
    assert.isTrue(await (await User.findOrFail(user.id)).verifyPassword('secret'))

    const [found] = await User.resetPassword(token, 'new-secret', { purpose: 'invitation' })
    assert.equal(found.id, user.id)
    assert.isTrue(await (await User.findOrFail(user.id)).verifyPassword('new-secret'))
  })

  test('should invalidate the pending reset tokens of the model after a reset', async ({
    assert,
  }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const other = await User.create({ email: 'john@example.com', password: 'secret' })
    const token = await user.generatePasswordResetToken()
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invitation' })
    await other.generatePasswordResetToken()
    await sentinel.magicLink.generateMagicLinkToken(user.id)

    await User.resetPassword(token, 'new-secret')

    assert.deepEqual(
      provider.tokens.map((t) => [t.tokenableId, t.kind]),
      [
        [other.id, PasswordManager.TOKEN_KIND],
        [user.id, 'magic_link'],
      ]
    )
  })

  test('should keep the password when the token is rejected', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    await user.generatePasswordResetToken()

    const error = await invalidToken(User.resetPassword('unknown-token', 'new-secret'))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.lengthOf(provider.tokens, 1)
    assert.isTrue(await (await User.findOrFail(user.id)).verifyPassword('secret'))
  })

  test('should update the password when the current one matches', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const other = await User.create({ email: 'john@example.com', password: 'secret' })
    await user.generatePasswordResetToken()
    await other.generatePasswordResetToken()

    await user.updatePassword('secret', 'new-secret')

    assert.notEqual(user.password, 'new-secret')
    assert.isTrue(await user.verifyPassword('new-secret'))

    const persisted = await User.findOrFail(user.id)
    assert.isTrue(await persisted.verifyPassword('new-secret'))
    assert.isFalse(await persisted.verifyPassword('secret'))

    assert.deepEqual(
      provider.tokens.map((t) => t.tokenableId),
      [other.id]
    )
  })

  test('should reject the update when the current password is wrong', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    await user.generatePasswordResetToken()

    await assert.rejects(
      () => user.updatePassword('wrong', 'new-secret'),
      E_INVALID_PASSWORD,
      'The current password is incorrect.'
    )

    assert.equal(E_INVALID_PASSWORD.code, 'E_INVALID_PASSWORD')
    assert.equal(E_INVALID_PASSWORD.status, 400)
    assert.lengthOf(provider.tokens, 1)
    assert.isTrue(await (await User.findOrFail(user.id)).verifyPassword('secret'))
  })

  test('should write the password to the configured property', async ({ assert }) => {
    const account = await Account.create({
      email: 'jane@example.com',
      username: 'jane',
      passwordHash: 'secret',
    })
    assert.notEqual(account.passwordHash, 'secret')

    const token = await account.generatePasswordResetToken()
    const [found] = await Account.resetPassword(token, 'new-secret')
    assert.notEqual(found.passwordHash, 'new-secret')
    assert.isTrue(await (await Account.findOrFail(account.id)).verifyPassword('new-secret'))

    await found.updatePassword('new-secret', 'newer-secret')
    assert.isTrue(await (await Account.findOrFail(account.id)).verifyPassword('newer-secret'))
  })

  test('should invalidate the pending reset tokens of the model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com', password: 'secret' })
    const other = await User.create({ email: 'john@example.com', password: 'secret' })
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invitation' })
    await other.generatePasswordResetToken()

    await user.invalidatePasswordResetTokens({ purpose: 'invitation' })
    assert.deepEqual(
      provider.tokens.map((t) => [t.tokenableId, t.purpose]),
      [
        [user.id, 'reset'],
        [other.id, 'reset'],
      ]
    )

    await user.invalidatePasswordResetTokens()
    assert.deepEqual(
      provider.tokens.map((t) => [t.tokenableId, t.purpose]),
      [[other.id, 'reset']]
    )
  })
})
