import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Database } from '@adonisjs/lucid/database'
import { compose, Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import { EmailManagerFactory } from '../../factories/email.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { EmailManager, type EmailManagerConfig } from '../../modules/email/manager.ts'
import { E_EMAIL_ALREADY_VERIFIED } from '../../modules/email/errors.ts'
import { withEmail, type WithEmailOptions } from '../../modules/email/mixins/with_email.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { LucidTokenProvider } from '../../modules/token/providers/lucid.ts'
import { createDatabase, createTables, freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>

const EMAIL = 'contact@friendsofadonis.com'
const NEW_EMAIL = 'hello@friendsofadonis.com'
const NOW = new Date('2026-01-01T10:00:00.000Z')

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

/**
 * Returns the persisted tokens, oldest first
 */
function tokenRows(db: Database) {
  return db.from('sentinel_tokens').orderBy('id')
}

/**
 * Returns the persisted row of a user
 */
function userRow(db: Database, id: number) {
  return db.from('users').where('id', id).firstOrFail()
}

/**
 * Manager persisting its tokens in the database, next to the users
 */
function createManager(db: Database, config: EmailManagerConfig = {}) {
  const tokens = new TokenManagerFactory().withProvider(new LucidTokenProvider(db)).create()
  const manager = new EmailManagerFactory().withTokens(tokens).create(config)

  return { tokens, manager }
}

function setupModel(manager: EmailManager, defaults: WithEmailOptions = {}) {
  class User extends compose(BaseModel, manager.withEmail(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string | null

    @column()
    declare unverifiedEmail: string | null

    @column.dateTime()
    declare emailVerifiedAt: DateTime | null
  }

  return User
}

async function setup(config: EmailManagerConfig = {}, defaults: WithEmailOptions = {}) {
  const db = await createDatabase()
  await createTables(db)

  const { tokens, manager } = createManager(db, config)
  const User = setupModel(manager, defaults)

  /**
   * A user fresh from signup: an email address never verified
   */
  const user = await User.create({ email: EMAIL })

  return { db, tokens, manager, User, user }
}

/**
 * Verifies the signup address of the user, so that the tests start
 * from a verified account
 */
async function verified({ User, user }: Awaited<ReturnType<typeof setup>>) {
  const token = await user.generateEmailVerificationToken()
  const [instance] = await User.verifyEmail(token)
  return instance
}

test.group('Email mixin | generateEmailVerificationToken', () => {
  test('create a token for the signup address never verified', async ({ assert }) => {
    const { db, user } = await setup()
    const token = await user.generateEmailVerificationToken()

    assert.instanceOf(token, Secret)

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].kind, EmailManager.TOKEN_KIND)
    assert.equal(rows[0].name, EMAIL)
    assert.isNull(rows[0].purpose)
  })

  test('create a token for the pending address of a change', async ({ assert }) => {
    const context = await setup()
    const user = await verified(context)

    await user.changeEmail(NEW_EMAIL)
    await user.generateEmailVerificationToken()

    const rows = await tokenRows(context.db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].name, NEW_EMAIL)
  })

  test('refuse a verified row without pending change', async ({ assert }) => {
    const context = await setup()
    const user = await verified(context)

    const error = await rejection<InstanceType<typeof E_EMAIL_ALREADY_VERIFIED>>(() =>
      user.generateEmailVerificationToken()
    )

    assert.instanceOf(error, E_EMAIL_ALREADY_VERIFIED)
    assert.equal(error.code, 'E_EMAIL_ALREADY_VERIFIED')
    assert.equal(error.status, 400)
    assert.isEmpty(await tokenRows(context.db))
  })

  test('refuse a row without email address', async ({ assert }) => {
    const { db, User } = await setup()
    const user = await User.create({})

    await assert.rejects(
      () => user.generateEmailVerificationToken(),
      RuntimeException,
      /Cannot generate an email verification token for "User": it has no email address/
    )
    assert.isEmpty(await tokenRows(db))
  })

  test('apply the defaults of the mixin over the config of the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      { expiresIn: '1d' },
      { purpose: 'signup', expiresIn: '2h', metadata: { redirect: '/welcome' } }
    )
    await user.generateEmailVerificationToken()

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'signup')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/welcome' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 2 * 60 * 60))
  })

  test('give precedence to the options given at creation time', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup({}, { purpose: 'signup', expiresIn: '2h' })
    await user.generateEmailVerificationToken({ purpose: 'change', expiresIn: '5m' })

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'change')
    assert.deepEqual(new Date(row.expires_at), after(NOW, 5 * 60))
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { db, User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.generateEmailVerificationToken(),
      RuntimeException,
      /Cannot generate an email verification token for an unsaved "User": the primary key is empty/
    )
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Email mixin | changeEmail', () => {
  test('stage the new address of a verified row', async ({ assert }) => {
    const context = await setup()
    const user = await verified(context)

    await user.changeEmail(NEW_EMAIL)

    assert.equal(user.pendingEmail, NEW_EMAIL)
    assert.isTrue(user.hasVerifiedEmail)

    const row = await userRow(context.db, user.id)
    assert.equal(row.email, EMAIL)
    assert.equal(row.unverified_email, NEW_EMAIL)
    assert.isNotNull(row.email_verified_at)
  })

  test('replace the address of a row never verified', async ({ assert }) => {
    const { db, user } = await setup()

    await user.changeEmail(NEW_EMAIL)

    assert.isNull(user.pendingEmail)
    assert.isFalse(user.hasVerifiedEmail)

    const row = await userRow(db, user.id)
    assert.equal(row.email, NEW_EMAIL)
    assert.isNull(row.unverified_email)
    assert.isNull(row.email_verified_at)
  })

  test('cancel the pending change when given the verified address back', async ({ assert }) => {
    const context = await setup()
    const user = await verified(context)
    await user.changeEmail(NEW_EMAIL)

    await user.changeEmail(EMAIL)

    assert.isNull(user.pendingEmail)
    assert.isTrue(user.hasVerifiedEmail)

    const row = await userRow(context.db, user.id)
    assert.equal(row.email, EMAIL)
    assert.isNull(row.unverified_email)
    assert.isNotNull(row.email_verified_at)
  })

  test('replace the pending change when requested again', async ({ assert }) => {
    const context = await setup()
    const user = await verified(context)
    await user.changeEmail(NEW_EMAIL)

    await user.changeEmail('team@friendsofadonis.com')

    assert.equal(user.pendingEmail, 'team@friendsofadonis.com')
    assert.equal((await userRow(context.db, user.id)).unverified_email, 'team@friendsofadonis.com')
  })

  test('invalidate the pending tokens whatever their purpose', async ({ assert }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'team@friendsofadonis.com' })

    await user.generateEmailVerificationToken()
    await user.generateEmailVerificationToken({ purpose: 'signup' })
    await other.generateEmailVerificationToken()

    await user.changeEmail(NEW_EMAIL)

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.tokenable_id),
      [other.id]
    )
  })

  test('refuse an empty address', async ({ assert }) => {
    const { db, user } = await setup()

    await assert.rejects(
      () => user.changeEmail(''),
      RuntimeException,
      /Cannot change the email of "User": the address is empty/
    )
    assert.equal((await userRow(db, user.id)).email, EMAIL)
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.changeEmail(NEW_EMAIL),
      RuntimeException,
      /Cannot change the email of an unsaved "User": the primary key is empty/
    )
  })
})

test.group('Email mixin | verifyEmail', () => {
  test('stamp the signup address and return the model along with the metadata', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { db, User, user } = await setup()
    const token = await user.generateEmailVerificationToken({ metadata: { redirect: '/home' } })

    const [found, metadata] = await User.verifyEmail(token)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, EMAIL)
    assert.isTrue(found.hasVerifiedEmail)
    assert.deepEqual(found.emailVerifiedAt?.toJSDate(), NOW)
    assert.deepEqual(metadata, { redirect: '/home' })

    const row = await userRow(db, user.id)
    assert.equal(row.email, EMAIL)
    assert.isNotNull(row.email_verified_at)
    assert.isEmpty(await tokenRows(db))
  })

  test('promote the pending address of a change', async ({ assert }) => {
    freezeTime(NOW)
    const context = await setup()
    const user = await verified(context)
    await user.changeEmail(NEW_EMAIL)
    const token = await user.generateEmailVerificationToken()

    freezeTime(after(NOW, 60))
    const [found] = await context.User.verifyEmail(token)

    assert.equal(found.email, NEW_EMAIL)
    assert.isNull(found.pendingEmail)
    assert.deepEqual(found.emailVerifiedAt?.toJSDate(), after(NOW, 60))

    const row = await userRow(context.db, user.id)
    assert.equal(row.email, NEW_EMAIL)
    assert.isNull(row.unverified_email)
  })

  test('leave the swapped columns clean on the returned model', async ({ assert }) => {
    const { User, user } = await setup()
    const token = await user.generateEmailVerificationToken()

    const [found] = await User.verifyEmail(token)

    assert.deepEqual(found.$dirty, {})
  })

  test('accept the token as a string', async ({ assert }) => {
    const { User, user } = await setup()
    const token = await user.generateEmailVerificationToken()

    const [found] = await User.verifyEmail(token.release())

    assert.equal(found.id, user.id)
    assert.isTrue(found.hasVerifiedEmail)
  })

  test('consume the token, so verifying it again fails', async ({ assert }) => {
    const { User, user } = await setup()
    const token = await user.generateEmailVerificationToken()

    await User.verifyEmail(token)
    await assert.rejects(() => User.verifyEmail(token), E_INVALID_TOKEN)
  })

  test('invalidate the remaining tokens of the row', async ({ assert }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'team@friendsofadonis.com' })

    const token = await user.generateEmailVerificationToken()
    const remaining = await user.generateEmailVerificationToken({ purpose: 'signup' })
    await other.generateEmailVerificationToken()

    await User.verifyEmail(token)

    assert.deepEqual(
      (await tokenRows(db)).map((row) => row.tokenable_id),
      [other.id]
    )
    await assert.rejects(() => User.verifyEmail(remaining, { purpose: 'signup' }), E_INVALID_TOKEN)
  })

  test('refuse a token whose address is no longer the one awaiting verification', async ({
    assert,
  }) => {
    const { db, manager, User, user } = await setup()
    const token = await manager.generateEmailVerificationToken(user.id, 'other@example.com')

    const error = await rejection<InvalidTokenException>(() => User.verifyEmail(token))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, EmailManager.TOKEN_KIND)

    const row = await userRow(db, user.id)
    assert.equal(row.email, EMAIL)
    assert.isNull(row.email_verified_at)
  })

  test('refuse the swap when a concurrent change moved the pending address', async ({ assert }) => {
    const context = await setup()
    const { db, User } = context
    const user = await verified(context)
    await user.changeEmail(NEW_EMAIL)
    const token = await user.generateEmailVerificationToken()

    /**
     * Move the pending address between the load of the row and the
     * compare and swap, the way a concurrent request would
     */
    const originalFind = User.find.bind(User)
    ;(User as any).find = async (...args: unknown[]) => {
      const instance = await (originalFind as any)(...args)
      await db.from('users').where('id', user.id).update({ unverified_email: 'raced@example.com' })
      return instance
    }

    await assert.rejects(() => User.verifyEmail(token), E_INVALID_TOKEN)

    const row = await userRow(db, user.id)
    assert.equal(row.email, EMAIL)
    assert.equal(row.unverified_email, 'raced@example.com')
  })

  test('verify the token against the default purpose of the mixin', async ({ assert }) => {
    const { User, user } = await setup({}, { purpose: 'signup' })
    const token = await user.generateEmailVerificationToken()

    const [found] = await User.verifyEmail(token)

    assert.equal(found.id, user.id)
    assert.isTrue(found.hasVerifiedEmail)
  })

  test('give precedence to the purpose given at verification time', async ({ assert }) => {
    const { User, user } = await setup({}, { purpose: 'signup' })
    const token = await user.generateEmailVerificationToken({ purpose: 'change' })

    const error = await rejection<InvalidTokenException>(() => User.verifyEmail(token))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'signup')

    const [found] = await User.verifyEmail(token, { purpose: 'change' })
    assert.equal(found.id, user.id)
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { User, user } = await setup({}, { purpose: 'signup' })
    const token = await user.generateEmailVerificationToken({ purpose: undefined })

    await assert.rejects(() => User.verifyEmail(token), E_INVALID_TOKEN)

    const [found] = await User.verifyEmail(token, { purpose: undefined })
    assert.equal(found.id, user.id)
  })

  test('refuse an unknown token', async ({ assert }) => {
    const { User } = await setup()

    const error = await rejection<InvalidTokenException>(() => User.verifyEmail('unknown-token'))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, EmailManager.TOKEN_KIND)
  })

  test('refuse an expired token', async ({ assert }) => {
    freezeTime(NOW)
    const { db, User, user } = await setup({ expiresIn: '1d' })
    const token = await user.generateEmailVerificationToken()

    freezeTime(after(NOW, 24 * 60 * 60 + 1))
    await assert.rejects(() => User.verifyEmail(token), E_INVALID_TOKEN)

    assert.isNull((await userRow(db, user.id)).email_verified_at)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse the token once the model no longer exists', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generateEmailVerificationToken()
    await user.delete()

    const error = await rejection<InvalidTokenException>(() => User.verifyEmail(token))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, EmailManager.TOKEN_KIND)
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Email mixin | invalidateEmailVerificationTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'team@friendsofadonis.com' })

    await user.generateEmailVerificationToken()
    await user.generateEmailVerificationToken({ purpose: 'signup' })
    await other.generateEmailVerificationToken()

    await user.invalidateEmailVerificationTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => [row.tokenable_id, row.purpose]),
      [
        [user.id, 'signup'],
        [other.id, null],
      ]
    )
  })

  test('inherit the default purpose of the mixin', async ({ assert }) => {
    const { db, user } = await setup({}, { purpose: 'signup' })
    await user.generateEmailVerificationToken()
    await user.generateEmailVerificationToken({ purpose: 'change' })

    await user.invalidateEmailVerificationTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['change']
    )
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, user } = await setup({}, { purpose: 'signup' })
    await user.generateEmailVerificationToken({ purpose: undefined })
    await user.generateEmailVerificationToken()

    await user.invalidateEmailVerificationTokens({ purpose: undefined })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['signup']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { db, tokens, user } = await setup()
    await user.generateEmailVerificationToken()
    await tokens.create(user.id, new Secret('123456'), { kind: 'otp' })

    await user.invalidateEmailVerificationTokens()

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
      () => user.invalidateEmailVerificationTokens(),
      RuntimeException,
      /Cannot invalidate the email verification tokens of an unsaved "User": the primary key is empty/
    )
  })
})

test.group('Email mixin | apply', () => {
  test('apply the mixin standalone with a manager', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withEmail(manager, { purpose: 'signup' })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string | null

      @column()
      declare unverifiedEmail: string | null

      @column.dateTime()
      declare emailVerifiedAt: DateTime | null
    }

    const user = await User.create({ email: EMAIL })
    const token = await user.generateEmailVerificationToken()
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'signup')

    const [found] = await User.verifyEmail(token)
    assert.instanceOf(found, User)
    assert.isTrue(found.hasVerifiedEmail)
  })

  test('resolve the columns from the configured names', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    await db.connection().schema.createTable('accounts', (table) => {
      table.increments()
      table.string('address').nullable()
      table.string('pending_address').nullable()
      table.timestamp('address_verified_at').nullable()
    })

    class Account extends compose(
      BaseModel,
      withEmail(manager, {
        emailColumnName: 'address',
        unverifiedEmailColumnName: 'pendingAddress',
        emailVerifiedAtColumnName: 'addressVerifiedAt',
      })
    ) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare address: string | null

      @column()
      declare pendingAddress: string | null

      @column.dateTime()
      declare addressVerifiedAt: DateTime | null
    }

    const account = await Account.create({ address: EMAIL })
    const token = await account.generateEmailVerificationToken()

    const [found] = await Account.verifyEmail(token)
    assert.isTrue(found.hasVerifiedEmail)
    assert.isNull(found.pendingEmail)

    await found.changeEmail(NEW_EMAIL)
    assert.equal(found.pendingEmail, NEW_EMAIL)

    const row = await db.from('accounts').where('id', account.id).firstOrFail()
    assert.equal(row.address, EMAIL)
    assert.equal(row.pending_address, NEW_EMAIL)
    assert.isNotNull(row.address_verified_at)
  })

  test('report a column missing from the model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withEmail(manager)) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string | null
    }

    const user = await User.create({ email: EMAIL })

    await assert.rejects(
      () => user.changeEmail(NEW_EMAIL),
      RuntimeException,
      /The "unverifiedEmail" property is not a column of the "User" model/
    )
  })
})
