import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Database } from '@adonisjs/lucid/database'
import { compose, Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { Hash } from '@adonisjs/core/hash'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import { PasswordManagerFactory } from '../../factories/password.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { PasswordManager, type PasswordManagerConfig } from '../../modules/password/manager.ts'
import { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../../modules/password/errors.ts'
import {
  withPassword,
  type WithPasswordOptions,
} from '../../modules/password/mixins/with_password.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { LucidTokenProvider } from '../../modules/token/providers/lucid.ts'
import { createDatabase, createTables, freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>
type InvalidCredentialsException = InstanceType<typeof E_INVALID_CREDENTIALS>
type InvalidPasswordException = InstanceType<typeof E_INVALID_PASSWORD>

/**
 * Shape of the error raised by "validatePassword"
 */
type ValidationError = Error & {
  code: string
  status: number
  messages: { field: string; message: string; rule: string }[]
}

const NOW = new Date('2026-01-01T10:00:00.000Z')

/**
 * A hash computed by the scrypt hasher of "@adonisjs/hash"
 */
const SCRYPT_HASH = /^\$scrypt\$/

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Returns the persisted tokens, oldest first
 */
function tokenRows(db: Database) {
  return db.from('sentinel_tokens').orderBy('id')
}

/**
 * Scrypt hasher computing hashes with a lower cost than the default
 * one, as an outdated "config/hash.ts" would have
 */
function outdatedHasher() {
  return new HashManagerFactory({
    default: 'scrypt',
    list: { scrypt: () => new Scrypt({ cost: 4096 }) },
  })
    .create()
    .use('scrypt')
}

/**
 * Adds a nullable password column to the shared "users" table, which
 * has none since the other modules do not need one
 */
async function addPasswordColumn(db: Database, columnName = 'password') {
  await db
    .connection()
    .schema.alterTable('users', (table) => {
      table.string(columnName).nullable()
    })
}

/**
 * Manager persisting its tokens in the database, next to the users
 */
function createManager(db: Database, config: PasswordManagerConfig = {}, hash?: Hash) {
  const hasher = hash ?? new HashManagerFactory().create().use('scrypt')
  const tokens = new TokenManagerFactory().withProvider(new LucidTokenProvider(db)).create()
  const manager = new PasswordManagerFactory().withTokens(tokens).withHash(hasher).create(config)

  return { hash: hasher, tokens, manager }
}

function setupModel(manager: PasswordManager, defaults: WithPasswordOptions = {}) {
  class User extends compose(BaseModel, manager.withPassword(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string

    @column()
    declare username: string | null

    @column()
    declare password: string | null
  }

  return User
}

async function setup(config: PasswordManagerConfig = {}, defaults: WithPasswordOptions = {}) {
  const db = await createDatabase()
  await createTables(db)
  await addPasswordColumn(db)

  const { hash, tokens, manager } = createManager(db, config)
  const User = setupModel(manager, defaults)
  const user = await User.create({
    email: 'virk@adonisjs.com',
    username: 'virk',
    password: 'secret',
  })

  return { db, hash, tokens, manager, User, user }
}

test.group('Password mixin | hashPassword', () => {
  test('hash the password before saving the model', async ({ assert }) => {
    const { db, hash, user } = await setup()

    assert.match(user.password!, SCRYPT_HASH)
    assert.notInclude(user.password!, 'secret')

    const row = await db.from('users').where('id', user.id).first()
    assert.equal(row.password, user.password)
    assert.isTrue(await hash.verify(row.password, 'secret'))
  })

  test('hash the password again when it changes', async ({ assert }) => {
    const { db, hash, user } = await setup()
    const previous = user.password

    user.merge({ password: 'reset' })
    await user.save()

    const row = await db.from('users').where('id', user.id).first()
    assert.notEqual(row.password, previous)
    assert.match(row.password, SCRYPT_HASH)
    assert.isTrue(await hash.verify(row.password, 'reset'))
  })

  test('leave the hash untouched when saving without a change', async ({ assert }) => {
    const { db, user } = await setup()
    const previous = user.password

    user.merge({ email: 'virk@example.com' })
    await user.save()

    const row = await db.from('users').where('id', user.id).first()
    assert.equal(row.password, previous)
    assert.isTrue(await user.verifyPassword('secret'))
  })

  test('hash through the configured column', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    await addPasswordColumn(db, 'hashed_password')
    const { hash, manager } = createManager(db)

    class User extends compose(
      BaseModel,
      manager.withPassword({ passwordColumnName: 'hashedPassword' })
    ) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string

      @column()
      declare hashedPassword: string | null
    }

    const user = await User.create({ email: 'virk@adonisjs.com', hashedPassword: 'secret' })

    assert.match(user.hashedPassword!, SCRYPT_HASH)
    assert.isTrue(await hash.verify(user.hashedPassword!, 'secret'))
    assert.equal(user.getPassword(), user.hashedPassword)
    assert.isTrue(await user.verifyPassword('secret'))

    const found = await User.verifyCredentials('virk@adonisjs.com', 'secret')
    assert.equal(found.id, user.id)
  })
})

test.group('Password mixin | verifyCredentials', () => {
  test('return the user of the matching uid and password', async ({ assert }) => {
    const { User, user } = await setup()

    const found = await User.verifyCredentials('virk@adonisjs.com', 'secret')

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'virk@adonisjs.com')
  })

  test('find the user by the email only by default', async ({ assert }) => {
    const { User } = await setup()

    await assert.rejects(() => User.verifyCredentials('virk', 'secret'), E_INVALID_CREDENTIALS)
  })

  test('find the user by any of the configured uids', async ({ assert }) => {
    const { User, user } = await setup({}, { uids: ['email', 'username'] })

    const byEmail = await User.verifyCredentials('virk@adonisjs.com', 'secret')
    const byUsername = await User.verifyCredentials('virk', 'secret')

    assert.equal(byEmail.id, user.id)
    assert.equal(byUsername.id, user.id)
  })

  test('refuse an unknown uid', async ({ assert }) => {
    const { User } = await setup()

    const error = await rejection<InvalidCredentialsException>(() =>
      User.verifyCredentials('romain@adonisjs.com', 'secret')
    )

    assert.instanceOf(error, E_INVALID_CREDENTIALS)
    assert.equal(error.code, 'E_INVALID_CREDENTIALS')
    assert.equal(error.status, 400)
    assert.equal(error.message, 'Invalid user credentials')
  })

  test('refuse a wrong password', async ({ assert }) => {
    const { User } = await setup()

    const error = await rejection<InvalidCredentialsException>(() =>
      User.verifyCredentials('virk@adonisjs.com', 'nope')
    )

    assert.instanceOf(error, E_INVALID_CREDENTIALS)
    assert.equal(error.code, 'E_INVALID_CREDENTIALS')
  })

  test('refuse an empty {field}')
    .with([
      { field: 'uid', uid: '', password: 'secret' },
      { field: 'password', uid: 'virk@adonisjs.com', password: '' },
    ])
    .run(async ({ assert }, { uid, password }) => {
      const { User } = await setup()

      await assert.rejects(() => User.verifyCredentials(uid, password), E_INVALID_CREDENTIALS)
    })

  test('report an unknown uid and a wrong password the same way', async ({ assert }) => {
    const { User } = await setup()

    const unknownUid = await rejection<InvalidCredentialsException>(() =>
      User.verifyCredentials('romain@adonisjs.com', 'secret')
    )
    const wrongPassword = await rejection<InvalidCredentialsException>(() =>
      User.verifyCredentials('virk@adonisjs.com', 'nope')
    )

    assert.deepEqual(
      [unknownUid.code, unknownUid.status, unknownUid.message],
      [wrongPassword.code, wrongPassword.status, wrongPassword.message]
    )
  })

  test('rewrite a hash made with outdated options on the way', async ({ assert }) => {
    const { db, hash, User, user } = await setup()

    const outdated = await outdatedHasher().make('secret')
    await db.from('users').where('id', user.id).update({ password: outdated })
    assert.isTrue(hash.needsReHash(outdated))

    const found = await User.verifyCredentials('virk@adonisjs.com', 'secret')

    const row = await db.from('users').where('id', user.id).first()
    assert.notEqual(row.password, outdated)
    assert.isFalse(hash.needsReHash(row.password))
    assert.isTrue(await hash.verify(row.password, 'secret'))
    assert.equal(found.getPassword(), row.password)
  })

  test('keep an outdated hash when rehashing on verify is disabled', async ({ assert }) => {
    const { db, hash, User, user } = await setup({}, { rehashOnVerify: false })

    const outdated = await outdatedHasher().make('secret')
    await db.from('users').where('id', user.id).update({ password: outdated })
    assert.isTrue(hash.needsReHash(outdated))

    const found = await User.verifyCredentials('virk@adonisjs.com', 'secret')

    const row = await db.from('users').where('id', user.id).first()
    assert.equal(row.password, outdated)
    assert.equal(found.id, user.id)
  })

  test('throw when the password column is null', async ({ assert }) => {
    const { User } = await setup()
    await User.create({ email: 'romain@adonisjs.com' })

    await assert.rejects(
      () => User.verifyCredentials('romain@adonisjs.com', 'secret'),
      RuntimeException,
      /Cannot verify password/
    )
  })
})

test.group('Password mixin | verifyPassword', () => {
  test('accept the right password and refuse a wrong one', async ({ assert }) => {
    const { user } = await setup()

    assert.isTrue(await user.verifyPassword('secret'))
    assert.isFalse(await user.verifyPassword('nope'))
  })

  test('throw when the password column is null', async ({ assert }) => {
    const { User } = await setup()
    const user = await User.create({ email: 'romain@adonisjs.com' })

    await assert.rejects(
      () => user.verifyPassword('secret'),
      RuntimeException,
      /Cannot verify password/
    )
  })
})

test.group('Password mixin | getPassword', () => {
  test('return the hashed password', async ({ assert }) => {
    const { user } = await setup()

    assert.equal(user.getPassword(), user.password)
    assert.match(user.getPassword()!, SCRYPT_HASH)
  })

  test('return null when the model has no password', async ({ assert }) => {
    const { User } = await setup()
    const user = await User.create({ email: 'romain@adonisjs.com' })

    assert.isNull(user.getPassword())
  })
})

test.group('Password mixin | validatePassword', () => {
  test('accept the right password', async () => {
    const { user } = await setup()

    await user.validatePassword('secret')
  })

  test('report a wrong password as a validation error on the currentPassword field', async ({
    assert,
  }) => {
    const { user } = await setup()

    const error = await rejection<ValidationError>(() => user.validatePassword('nope'))

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
  })

  test('report the error on the given field', async ({ assert }) => {
    const { user } = await setup()

    const error = await rejection<ValidationError>(() =>
      user.validatePassword('nope', 'oldPassword')
    )

    assert.equal(error.messages[0].field, 'oldPassword')
  })
})

test.group('Password mixin | updatePassword', () => {
  test('replace the password after verifying the current one', async ({ assert }) => {
    const { db, hash, User, user } = await setup()

    await user.updatePassword('secret', 'reset')

    assert.isTrue(await user.verifyPassword('reset'))
    assert.isFalse(await user.verifyPassword('secret'))

    const row = await db.from('users').where('id', user.id).first()
    assert.match(row.password, SCRYPT_HASH)
    assert.isTrue(await hash.verify(row.password, 'reset'))

    const found = await User.verifyCredentials('virk@adonisjs.com', 'reset')
    assert.equal(found.id, user.id)
  })

  test('refuse a wrong current password', async ({ assert }) => {
    const { db, user } = await setup()

    const error = await rejection<InvalidPasswordException>(() =>
      user.updatePassword('nope', 'reset')
    )

    assert.instanceOf(error, E_INVALID_PASSWORD)
    assert.equal(error.code, 'E_INVALID_PASSWORD')
    assert.equal(error.status, 400)
    assert.equal(error.message, 'The current password is incorrect.')

    const row = await db.from('users').where('id', user.id).first()
    assert.equal(row.password, user.password)
    assert.isTrue(await user.verifyPassword('secret'))
  })

  test('invalidate the pending reset tokens, whatever their purpose', async ({ assert }) => {
    const { db, tokens, user } = await setup()
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invite' })
    await tokens.create(user.id, new Secret('123456'), { kind: 'otp' })

    await user.updatePassword('secret', 'reset')

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.kind),
      ['otp']
    )
  })
})

test.group('Password mixin | generatePasswordResetToken', () => {
  test('create a token for the primary key of the model', async ({ assert }) => {
    const { db, user } = await setup()
    const token = await user.generatePasswordResetToken()

    assert.instanceOf(token, Secret)

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].kind, PasswordManager.TOKEN_KIND)
    assert.equal(rows[0].hash, sha256(token.release()))
    assert.equal(rows[0].maximum_usage_count, 1)
    assert.isNull(rows[0].maximum_failed_attempts_count)
    assert.isNull(rows[0].purpose)
    assert.isNull(rows[0].metadata)
  })

  test('apply the defaults of the mixin over the config of the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      { expiresIn: '20m' },
      { purpose: 'invite', expiresIn: '2h', metadata: { redirect: '/dashboard' } }
    )
    await user.generatePasswordResetToken()

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'invite')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/dashboard' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 2 * 60 * 60))
  })

  test('give precedence to the options given at generation time', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      {},
      { purpose: 'invite', expiresIn: '2h', metadata: { redirect: '/dashboard' } }
    )
    await user.generatePasswordResetToken({
      purpose: 'recovery',
      expiresIn: '5m',
      metadata: { redirect: '/welcome' },
    })

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'recovery')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/welcome' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 5 * 60))
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { db, User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.generatePasswordResetToken(),
      RuntimeException,
      /Cannot generate a password reset token for an unsaved "User": the primary key is empty/
    )
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Password mixin | verifyPasswordResetToken', () => {
  test('return the model the token was created for along with the metadata', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generatePasswordResetToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyPasswordResetToken(token)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'virk@adonisjs.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(await tokenRows(db))
  })

  test('accept the token as a string', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generatePasswordResetToken()

    const [found, metadata] = await User.verifyPasswordResetToken(token.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(await tokenRows(db))
  })

  test('verify the token against the default purpose of the mixin', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken()

    const [found] = await User.verifyPasswordResetToken(token)

    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('give precedence to the purpose given at verification time', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken({ purpose: 'recovery' })

    const error = await rejection<InvalidTokenException>(() =>
      User.verifyPasswordResetToken(token)
    )
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'invite')

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].usage_count, 0)

    const [found] = await User.verifyPasswordResetToken(token, { purpose: 'recovery' })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken({ purpose: undefined })
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const error = await rejection<InvalidTokenException>(() =>
      User.verifyPasswordResetToken(token)
    )
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'invite')
    assert.lengthOf(await tokenRows(db), 1)

    const [found] = await User.verifyPasswordResetToken(token, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse the token once the model no longer exists', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken()
    await user.delete()

    const error = await rejection<InvalidTokenException>(() =>
      User.verifyPasswordResetToken(token)
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.equal(error.purpose, 'invite')
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Password mixin | resetPassword', () => {
  test('replace the password of the model the token was created for', async ({ assert }) => {
    const { db, hash, User, user } = await setup()
    const token = await user.generatePasswordResetToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.resetPassword(token, 'reset')

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isTrue(await found.verifyPassword('reset'))

    const row = await db.from('users').where('id', user.id).first()
    assert.match(row.password, SCRYPT_HASH)
    assert.isTrue(await hash.verify(row.password, 'reset'))

    const verified = await User.verifyCredentials('virk@adonisjs.com', 'reset')
    assert.equal(verified.id, user.id)
  })

  test('consume the token', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generatePasswordResetToken()

    await User.resetPassword(token, 'reset')

    await assert.rejects(() => User.resetPassword(token, 'again'), E_INVALID_TOKEN)
    assert.isEmpty(await tokenRows(db))
  })

  test('invalidate the other pending reset tokens, whatever their purpose', async ({ assert }) => {
    const { db, tokens, User, user } = await setup()
    const token = await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invite' })
    await user.generatePasswordResetToken({ purpose: 'recovery' })
    await tokens.create(user.id, new Secret('123456'), { kind: 'otp' })

    await User.resetPassword(token, 'reset')

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.kind),
      ['otp']
    )
  })

  test('refuse an invalid token without changing the password', async ({ assert }) => {
    const { db, User, user } = await setup()

    await assert.rejects(() => User.resetPassword('unknown-token', 'reset'), E_INVALID_TOKEN)

    const row = await db.from('users').where('id', user.id).first()
    assert.equal(row.password, user.password)
    assert.isTrue(await user.verifyPassword('secret'))
  })

  test('verify the token against the default purpose of the mixin', async ({ assert }) => {
    const { User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken()

    const [found] = await User.resetPassword(token, 'reset')

    assert.equal(found.id, user.id)
    assert.isTrue(await found.verifyPassword('reset'))
  })

  test('give precedence to the purpose given at reset time', async ({ assert }) => {
    const { User, user } = await setup({}, { purpose: 'invite' })
    const token = await user.generatePasswordResetToken({ purpose: 'recovery' })

    await assert.rejects(() => User.resetPassword(token, 'reset'), E_INVALID_TOKEN)
    assert.isTrue(await user.verifyPassword('secret'))

    const [found] = await User.resetPassword(token, 'reset', { purpose: 'recovery' })
    assert.equal(found.id, user.id)
    assert.isTrue(await found.verifyPassword('reset'))
  })

  test('refuse the token once the model no longer exists', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generatePasswordResetToken()
    await user.delete()

    const error = await rejection<InvalidTokenException>(() => User.resetPassword(token, 'reset'))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Password mixin | invalidatePasswordResetTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { db, user } = await setup()
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['invite']
    )
  })

  test('inherit the default purpose of the mixin', async ({ assert }) => {
    const { db, user } = await setup({}, { purpose: 'invite' })
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'recovery' })
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['recovery']
    )
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, user } = await setup({}, { purpose: 'invite' })
    await user.generatePasswordResetToken({ purpose: undefined })
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens({ purpose: undefined })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['invite']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { db, tokens, user } = await setup()
    await user.generatePasswordResetToken()
    await tokens.create(user.id, new Secret('123456'), { kind: 'otp' })

    await user.invalidatePasswordResetTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.kind),
      ['otp']
    )
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.invalidatePasswordResetTokens(),
      RuntimeException,
      /Cannot invalidate the password reset tokens of an unsaved "User": the primary key is empty/
    )
  })
})

test.group('Password mixin | apply', () => {
  test('apply the mixin through the manager without defaults', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    await addPasswordColumn(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, manager.withPassword()) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string

      @column()
      declare password: string | null
    }

    const user = await User.create({ email: 'virk@adonisjs.com', password: 'secret' })
    assert.match(user.password!, SCRYPT_HASH)

    const token = await user.generatePasswordResetToken()
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const [found] = await User.resetPassword(token, 'reset')
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)

    const verified = await User.verifyCredentials('virk@adonisjs.com', 'reset')
    assert.equal(verified.id, user.id)
  })

  test('apply the mixin standalone with a manager', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    await addPasswordColumn(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withPassword(manager, { purpose: 'invite' })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string

      @column()
      declare password: string | null
    }

    const user = await User.create({ email: 'virk@adonisjs.com', password: 'secret' })
    const token = await user.generatePasswordResetToken()
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'invite')

    const [found] = await User.verifyPasswordResetToken(token)
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })
})
