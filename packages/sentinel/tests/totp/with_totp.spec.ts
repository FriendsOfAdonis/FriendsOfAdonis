import { test } from '@japa/runner'
import { TOTP, URI } from 'otpauth'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { TOTPManagerFactory } from '../../factories/totp.ts'
import type { TOTPManagerConfig } from '../../modules/totp/manager.ts'
import { withTOTP, type WithTOTPOptions } from '../../modules/totp/mixins/with_totp.ts'
import { TOTPAuthenticator } from '../../modules/totp/models/totp_authenticator.ts'
import { createDatabase, createTables } from '../helpers.ts'

function setupModel(config: Partial<TOTPManagerConfig> = {}, defaults: WithTOTPOptions = {}) {
  const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis', ...config })
  TOTPAuthenticator.useManager(manager)

  class User extends compose(BaseModel, manager.withTOTP(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return { manager, User }
}

async function setup(config: Partial<TOTPManagerConfig> = {}, defaults: WithTOTPOptions = {}) {
  const db = await createDatabase()
  await createTables(db)

  const { manager, User } = setupModel(config, defaults)
  const user = await User.create({ email: 'virk@adonisjs.com' })

  return { db, manager, User, user }
}

async function confirm(authenticator: TOTPAuthenticator) {
  const totp = new TOTP({ secret: authenticator.getSecret().release() })
  await authenticator.validate(totp.generate())
  return authenticator
}

test.group('TOTP mixin | options', () => {
  test('resolve the options from the manager config', async ({ assert }) => {
    const { manager, user } = await setup({ digits: 8, period: 60 })

    assert.deepEqual(user.getTOTPOptions(), manager.config)
    assert.deepEqual(user.getTOTPOptions(), { issuer: 'FriendsOfAdonis', digits: 8, period: 60 })
  })

  test('give precedence to the defaults of the mixin', async ({ assert }) => {
    const { user } = await setup({ digits: 6, period: 60 }, { issuer: 'Acme', digits: 8 })

    assert.deepEqual(user.getTOTPOptions(), { issuer: 'Acme', digits: 8, period: 60 })
  })

  test('use the email of the model as label', async ({ assert }) => {
    const { user } = await setup()

    assert.equal(user.getTOTPLabel(), 'virk@adonisjs.com')
  })

  test('label the enrollments with the label of the model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis' })
    TOTPAuthenticator.useManager(manager)

    class User extends compose(BaseModel, manager.withTOTP()) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare username: string

      getTOTPLabel() {
        return this.username
      }
    }

    const user = await User.create({ username: 'virk' })
    const authenticator = await user.createAuthenticator()

    assert.equal(authenticator.label, 'virk')
    assert.equal((await db.from('totp_authenticators').first()).label, 'virk')
    assert.equal((URI.parse(authenticator.uri) as TOTP).label, 'virk')
  })

  test('apply the mixin standalone with a manager', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis' })
    TOTPAuthenticator.useManager(manager)

    class User extends compose(BaseModel, withTOTP(manager, { digits: 8 })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    assert.deepEqual(user.getTOTPOptions(), { issuer: 'FriendsOfAdonis', digits: 8 })

    const authenticator = await user.createAuthenticator()
    assert.instanceOf(authenticator, TOTPAuthenticator)
    assert.strictEqual(authenticator.tokenable, user)
  })
})

test.group('TOTP mixin | createAuthenticator', () => {
  test('enroll an authenticator linked to the model', async ({ assert }) => {
    const { db, user } = await setup()

    const authenticator = await user.createAuthenticator()
    assert.instanceOf(authenticator, TOTPAuthenticator)
    assert.strictEqual(authenticator.tokenable, user)
    assert.equal(authenticator.tokenableId, user.id)
    assert.equal(authenticator.label, 'virk@adonisjs.com')
    assert.isNull(authenticator.verifiedAt)

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, authenticator.id)
  })

  test('forward the options of the enrollment', async ({ assert }) => {
    const { user } = await setup()

    const authenticator = await user.createAuthenticator({ secretLength: 20, backupCodesCount: 3 })
    assert.lengthOf(authenticator.getSecret().release(), 32)
    assert.lengthOf(authenticator.getBackupCodes().release(), 3)
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.createAuthenticator(),
      RuntimeException,
      /Cannot create authenticator for an unsaved "User": the primary key is empty/
    )
  })
})

test.group('TOTP mixin | retrieveAuthenticator', () => {
  test('return null when the model has no authenticator', async ({ assert }) => {
    const { user } = await setup()

    assert.isNull(await user.retrieveAuthenticator())
    assert.isNull(await user.retrieveAuthenticator(true))
  })

  test('ignore an enrollment left unconfirmed unless asked for', async ({ assert }) => {
    const { user } = await setup()
    const authenticator = await user.createAuthenticator()

    assert.isNull(await user.retrieveAuthenticator())

    const unverified = await user.retrieveAuthenticator(true)
    assert.instanceOf(unverified, TOTPAuthenticator)
    assert.equal(unverified!.id, authenticator.id)
    assert.strictEqual(unverified!.tokenable, user)
  })

  test('return the authenticator in use once confirmed', async ({ assert }) => {
    const { user } = await setup()
    const authenticator = await confirm(await user.createAuthenticator())

    const retrieved = await user.retrieveAuthenticator()
    assert.instanceOf(retrieved, TOTPAuthenticator)
    assert.equal(retrieved!.id, authenticator.id)
    assert.isNotNull(retrieved!.verifiedAt)
    assert.strictEqual(retrieved!.tokenable, user)
  })

  test('prefer the newest enrollment when reaching the unconfirmed ones', async ({ assert }) => {
    const { user } = await setup()
    const inUse = await confirm(await user.createAuthenticator())
    const enrolling = await user.createAuthenticator()

    assert.equal((await user.retrieveAuthenticator())!.id, inUse.id)
    assert.equal((await user.retrieveAuthenticator(true))!.id, enrolling.id)
  })

  test('only reach the authenticators of the model', async ({ assert }) => {
    const { User, user } = await setup()
    const other = await User.create({ email: 'romain@adonisjs.com' })
    await confirm(await other.createAuthenticator())

    assert.isNull(await user.retrieveAuthenticator())
    assert.isNull(await user.retrieveAuthenticator(true))
    assert.equal((await other.retrieveAuthenticator())!.tokenableId, other.id)
  })

  test('join the transaction the model is bound to', async ({ assert }) => {
    const { db, User, user } = await setup()

    const trx = await db.transaction()
    user.useTransaction(trx)

    const authenticator = await user.createAuthenticator()
    const retrieved = await user.retrieveAuthenticator(true)
    assert.equal(retrieved!.id, authenticator.id)
    assert.strictEqual(retrieved!.$trx, trx)

    await trx.rollback()

    const fresh = await User.findOrFail(user.id)
    assert.isNull(await fresh.retrieveAuthenticator(true))
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.retrieveAuthenticator(),
      RuntimeException,
      /Cannot retrieve authenticator for an unsaved "User": the primary key is empty/
    )
  })
})
