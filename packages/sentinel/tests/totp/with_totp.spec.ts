import { test } from '@japa/runner'
import { TOTP, URI } from 'otpauth'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { EncryptionFactory } from '@adonisjs/core/factories/encryption'
import { TOTPManagerFactory } from '../../factories/totp.ts'
import { TOTPManager, type TOTPManagerConfig } from '../../modules/totp/manager.ts'
import { withTOTP, type WithTOTPOptions } from '../../modules/totp/mixins/with_totp.ts'
import { TOTPAuthenticator } from '../../modules/totp/models/totp_authenticator.ts'
import { createDatabase, createForeignEncryption, createTables } from '../helpers.ts'

function setupModel(config: Partial<TOTPManagerConfig> = {}, defaults: WithTOTPOptions = {}) {
  const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis', ...config })

  class User extends compose(BaseModel, withTOTP({ ...defaults, manager })) {
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

    class User extends compose(BaseModel, withTOTP({ manager })) {
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

  test('apply the mixin with a manager and defaults', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    /**
     * Built by hand, the way an application without the service
     * provider would: no container and no wiring beside the mixin
     */
    const manager = new TOTPManager({ issuer: 'FriendsOfAdonis' }, new EncryptionFactory().create())

    class User extends compose(BaseModel, withTOTP({ manager, digits: 8 })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    assert.deepEqual(user.getTOTPOptions(), { issuer: 'FriendsOfAdonis', digits: 8 })
    assert.strictEqual(user.getTOTPManager(), manager)

    const authenticator = await user.createAuthenticator()
    assert.instanceOf(authenticator, TOTPAuthenticator)
    assert.strictEqual(authenticator.tokenable, user)
    assert.lengthOf(authenticator.getBackupCodes().release(), 10)

    const totp = new TOTP({ secret: authenticator.getSecret().release(), digits: 8 })
    assert.isTrue(await authenticator.validate(totp.generate()))
    assert.isNotNull(authenticator.verifiedAt)
  })
})

test.group('TOTP mixin | manager', () => {
  async function setupTwoManagers() {
    const db = await createDatabase()
    await createTables(db)

    const first = new TOTPManagerFactory().create({ issuer: 'First' })
    const second = new TOTPManagerFactory()
      .withEncryption(createForeignEncryption())
      .create({ issuer: 'Second' })

    class FirstUser extends compose(BaseModel, withTOTP({ manager: first })) {
      static table = 'users'

      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    class SecondUser extends compose(BaseModel, withTOTP({ manager: second })) {
      static table = 'users'

      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const firstUser = await FirstUser.create({ email: 'virk@adonisjs.com' })
    const secondUser = await SecondUser.create({ email: 'romain@adonisjs.com' })

    return { db, first, second, firstUser, secondUser }
  }

  test('hand each model the manager of its mixin', async ({ assert }) => {
    const { db, first, second, firstUser, secondUser } = await setupTwoManagers()

    assert.strictEqual(firstUser.getTOTPManager(), first)
    assert.strictEqual(secondUser.getTOTPManager(), second)

    const firstAuthenticator = await firstUser.createAuthenticator()
    const secondAuthenticator = await secondUser.createAuthenticator()

    /**
     * Each row round-trips through the manager of its model, even
     * though the managers hold different encryption keys
     */
    const rows = new Map<unknown, any>(
      (await db.from('totp_authenticators')).map((row) => [row.tokenable_id, row])
    )
    assert.equal(
      first.decryptSecret(rows.get(firstUser.id).secret).release(),
      firstAuthenticator.getSecret().release()
    )
    assert.equal(
      second.decryptSecret(rows.get(secondUser.id).secret).release(),
      secondAuthenticator.getSecret().release()
    )
  })

  test('refuse the rows encrypted under another manager', async ({ assert }) => {
    const { firstUser, secondUser } = await setupTwoManagers()
    const authenticator = await firstUser.createAuthenticator()

    const foreign = (await TOTPAuthenticator.findOrFail(authenticator.id)).link(secondUser)

    assert.throws(
      () => foreign.getSecret(),
      RuntimeException,
      /encrypted with a different application key/
    )
    assert.throws(() => foreign.getBackupCodes(), RuntimeException)
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

test.group('TOTP mixin | resolve', () => {
  test('resolve the manager from a function on every call', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    /**
     * The manager does not exist yet when the model is defined, the
     * way a service is undefined until the application has booted
     */
    let current: TOTPManager | undefined

    class User extends compose(BaseModel, withTOTP({ manager: () => current! })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    current = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis' })
    const user = await User.create({ email: 'virk@adonisjs.com' })

    assert.strictEqual(user.getTOTPManager(), current)
    assert.deepEqual(user.getTOTPOptions(), { issuer: 'FriendsOfAdonis' })

    const authenticator = await user.createAuthenticator()
    assert.instanceOf(authenticator, TOTPAuthenticator)
  })

  test('override the manager on the model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis' })

    class User extends compose(BaseModel, withTOTP()) {
      static get $totpManager() {
        return manager
      }

      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    assert.strictEqual(User.$totpManager, manager)
    assert.strictEqual(new User().$totpManager, manager)
    assert.strictEqual(new User().getTOTPManager(), manager)
  })

  test('refuse to use the service before the application has booted', async ({ assert }) => {
    class User extends compose(BaseModel, withTOTP()) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = new User()

    assert.throws(
      () => user.getTOTPManager(),
      RuntimeException,
      /Cannot use the TOTP manager before the application has booted/
    )
  })
})
