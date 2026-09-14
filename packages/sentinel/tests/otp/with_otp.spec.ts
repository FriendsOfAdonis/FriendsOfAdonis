import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Database } from '@adonisjs/lucid/database'
import { compose, Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { OTPManagerFactory } from '../../factories/otp.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { OTPManager, type OTPManagerConfig } from '../../modules/otp/manager.ts'
import { withOTP, type WithOTPOptions } from '../../modules/otp/mixins/with_otp.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { LucidTokenProvider } from '../../modules/token/providers/lucid.ts'
import { createDatabase, createTables, freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>
type TooManyAttemptsException = InstanceType<typeof E_TOO_MANY_ATTEMPTS>

const NOW = new Date('2026-01-01T10:00:00.000Z')

/**
 * A hash computed by the scrypt hasher of "@adonisjs/hash"
 */
const SCRYPT_HASH = /^\$scrypt\$/

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

/**
 * Returns a code of the same length differing from the given one by
 * its first digit
 */
function wrongCode(code: Secret<string>) {
  const plain = code.release()
  return `${(Number(plain[0]) + 1) % 10}${plain.slice(1)}`
}

/**
 * Returns the persisted tokens, oldest first
 */
function tokenRows(db: Database) {
  return db.from('sentinel_tokens').orderBy('id')
}

/**
 * Manager persisting its tokens in the database, next to the users
 */
function createManager(db: Database, config: OTPManagerConfig = {}) {
  const hash = new HashManagerFactory<never>().create()
  const tokens = new TokenManagerFactory()
    .withProvider(new LucidTokenProvider(db))
    .withHash(hash)
    .create()
  const manager = new OTPManagerFactory().withTokens(tokens).create(config)

  return { hash, tokens, manager }
}

function setupModel(manager: OTPManager, defaults: WithOTPOptions = {}) {
  class User extends compose(BaseModel, withOTP({ ...defaults, manager })) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
}

async function setup(config: OTPManagerConfig = {}, defaults: WithOTPOptions = {}) {
  const db = await createDatabase()
  await createTables(db)

  const { hash, tokens, manager } = createManager(db, config)
  const User = setupModel(manager, defaults)
  const user = await User.create({ email: 'virk@adonisjs.com' })

  return { db, hash, tokens, manager, User, user }
}

test.group('OTP mixin | generateOTP', () => {
  test('create a code for the primary key of the model', async ({ assert }) => {
    const { db, hash, user } = await setup()
    const code = await user.generateOTP()

    assert.instanceOf(code, Secret)
    assert.match(code.release(), /^\d{6}$/)

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].kind, OTPManager.TOKEN_KIND)
    assert.match(rows[0].hash, SCRYPT_HASH)
    assert.isTrue(await hash.use('scrypt').verify(rows[0].hash, code.release()))
    assert.equal(rows[0].maximum_usage_count, 1)
    assert.equal(rows[0].maximum_failed_attempts_count, 5)
    assert.isNull(rows[0].purpose)
    assert.isNull(rows[0].metadata)
  })

  test('apply the defaults of the mixin over the config of the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      { length: 8, expiresIn: '20m', maximumFailedAttempts: 3 },
      {
        length: 4,
        purpose: 'signin',
        expiresIn: '1h',
        maximumFailedAttempts: 10,
        metadata: { redirect: '/dashboard' },
      }
    )
    const code = await user.generateOTP()

    assert.match(code.release(), /^\d{4}$/)

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'signin')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/dashboard' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 60 * 60))
    assert.equal(row.maximum_failed_attempts_count, 10)
  })

  test('give precedence to the options given at generation time', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      {},
      {
        length: 4,
        purpose: 'signin',
        expiresIn: '1h',
        maximumFailedAttempts: 10,
        metadata: { redirect: '/dashboard' },
      }
    )
    const code = await user.generateOTP({
      length: 8,
      purpose: 'signup',
      expiresIn: '5m',
      maximumFailedAttempts: 3,
      metadata: { redirect: '/welcome' },
    })

    assert.match(code.release(), /^\d{8}$/)

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'signup')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/welcome' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 5 * 60))
    assert.equal(row.maximum_failed_attempts_count, 3)
  })

  test('replace the pending code of the model', async ({ assert }) => {
    const { db, User, user } = await setup()

    /**
     * A longer first code, so that the two cannot collide
     */
    const first = await user.generateOTP({ length: 8 })
    const [{ id: previous }] = await tokenRows(db)

    const second = await user.generateOTP()

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.notEqual(rows[0].id, previous)

    await assert.rejects(() => User.verifyOTP(user.id, first), E_INVALID_TOKEN)

    const [found] = await User.verifyOTP(user.id, second)
    assert.equal(found.id, user.id)
  })

  test('replace the pending code of the same purpose only', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const other = await User.create({ email: 'romain@adonisjs.com' })
    await user.generateOTP()
    await user.generateOTP({ purpose: 'signup' })
    await other.generateOTP()

    await user.generateOTP()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => [row.tokenable_id, row.purpose]),
      [
        [user.id, 'signup'],
        [other.id, 'signin'],
        [user.id, 'signin'],
      ]
    )
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { db, User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.generateOTP(),
      RuntimeException,
      /Cannot generate an OTP for an unsaved "User": the primary key is empty/
    )
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('OTP mixin | verifyOTP', () => {
  test('return the model the code was generated for along with the metadata', async ({
    assert,
  }) => {
    const { db, User, user } = await setup()
    const code = await user.generateOTP({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyOTP(user.id, code)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'virk@adonisjs.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(await tokenRows(db))
  })

  test('accept the code as a string', async ({ assert }) => {
    const { db, User, user } = await setup()
    const code = await user.generateOTP()

    const [found, metadata] = await User.verifyOTP(user.id, code.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(await tokenRows(db))
  })

  test('verify the code against the default purpose of the mixin', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const code = await user.generateOTP()

    const [found] = await User.verifyOTP(user.id, code)

    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('give precedence to the purpose given at verification time', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const code = await user.generateOTP({ purpose: 'signup' })

    const error = await rejection<InvalidTokenException>(() => User.verifyOTP(user.id, code))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'signin')

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].failed_attempts_count, 0)

    const [found] = await User.verifyOTP(user.id, code, { purpose: 'signup' })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const code = await user.generateOTP({ purpose: undefined })
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const error = await rejection<InvalidTokenException>(() => User.verifyOTP(user.id, code))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(await tokenRows(db), 1)

    const [found] = await User.verifyOTP(user.id, code, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse a wrong code and count the attempt', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const code = await user.generateOTP()

    const error = await rejection<InvalidTokenException>(() =>
      User.verifyOTP(user.id, wrongCode(code))
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].usage_count, 0)
    assert.equal(rows[0].failed_attempts_count, 1)
  })

  test('lock the code once the wrong attempts reach the maximum', async ({ assert }) => {
    const { db, User, user } = await setup({ maximumFailedAttempts: 2 }, { purpose: 'signin' })
    const code = await user.generateOTP()
    const wrong = wrongCode(code)

    const first = await rejection<InvalidTokenException>(() => User.verifyOTP(user.id, wrong))
    assert.instanceOf(first, E_INVALID_TOKEN)
    assert.notInstanceOf(first, E_TOO_MANY_ATTEMPTS)
    assert.equal(first.purpose, 'signin')
    assert.equal((await tokenRows(db))[0].failed_attempts_count, 1)

    const error = await rejection<TooManyAttemptsException>(() => User.verifyOTP(user.id, wrong))

    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.status, 429)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(await tokenRows(db))

    /**
     * The locked code is removed, so the right one is refused as
     * unknown from now on
     */
    const refused = await rejection(() => User.verifyOTP(user.id, code))
    assert.instanceOf(refused, E_INVALID_TOKEN)
    assert.notInstanceOf(refused, E_TOO_MANY_ATTEMPTS)
  })

  test('refuse a code already used', async ({ assert }) => {
    const { User, user } = await setup()
    const code = await user.generateOTP()

    await User.verifyOTP(user.id, code)
    await assert.rejects(() => User.verifyOTP(user.id, code), E_INVALID_TOKEN)
  })

  test('refuse an expired code', async ({ assert }) => {
    freezeTime(NOW)
    const { db, User, user } = await setup({ expiresIn: '20m' })
    const code = await user.generateOTP()

    freezeTime(after(NOW, 20 * 60 + 1))
    await assert.rejects(() => User.verifyOTP(user.id, code), E_INVALID_TOKEN)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse the code of another model and count the attempt against its own code', async ({
    assert,
  }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'romain@adonisjs.com' })
    const code = await user.generateOTP()

    /**
     * A longer code, so that the two cannot collide
     */
    await other.generateOTP({ length: 8 })

    await assert.rejects(() => User.verifyOTP(other.id, code), E_INVALID_TOKEN)

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => [row.tokenable_id, row.failed_attempts_count]),
      [
        [user.id, 0],
        [other.id, 1],
      ]
    )

    const [found] = await User.verifyOTP(user.id, code)
    assert.equal(found.id, user.id)
  })

  test('refuse the code once the model no longer exists', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const code = await user.generateOTP()
    await user.delete()

    const error = await rejection<InvalidTokenException>(() => User.verifyOTP(user.id, code))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('OTP mixin | invalidateOTPs', () => {
  test('invalidate the codes without purpose by default', async ({ assert }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'romain@adonisjs.com' })

    const plain = await user.generateOTP()
    const signin = await user.generateOTP({ purpose: 'signin' })
    const foreign = await other.generateOTP()

    await user.invalidateOTPs()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => [row.tokenable_id, row.purpose]),
      [
        [user.id, 'signin'],
        [other.id, null],
      ]
    )

    await assert.rejects(() => User.verifyOTP(user.id, plain), E_INVALID_TOKEN)

    const [self] = await User.verifyOTP(user.id, signin, { purpose: 'signin' })
    assert.equal(self.id, user.id)

    const [found] = await User.verifyOTP(other.id, foreign)
    assert.equal(found.id, other.id)
  })

  test('invalidate the codes of a purpose only', async ({ assert }) => {
    const { db, user } = await setup()
    await user.generateOTP()
    await user.generateOTP({ purpose: 'signin' })
    await user.generateOTP({ purpose: 'signup' })

    await user.invalidateOTPs({ purpose: 'signin' })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      [null, 'signup']
    )
  })

  test('inherit the default purpose of the mixin', async ({ assert }) => {
    const { db, user } = await setup({}, { purpose: 'signin' })
    await user.generateOTP()
    await user.generateOTP({ purpose: 'signup' })
    await user.generateOTP({ purpose: 'signin' })

    await user.invalidateOTPs()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['signup']
    )
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, user } = await setup({}, { purpose: 'signin' })
    await user.generateOTP({ purpose: undefined })
    await user.generateOTP({ purpose: 'signin' })

    await user.invalidateOTPs({ purpose: undefined })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['signin']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { db, tokens, user } = await setup()
    await user.generateOTP()
    await tokens.create(user.id, new Secret('magic-link-token'), { kind: 'magic_link' })

    await user.invalidateOTPs()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.kind),
      ['magic_link']
    )
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.invalidateOTPs(),
      RuntimeException,
      /Cannot invalidate the OTPs of an unsaved "User": the primary key is empty/
    )
  })
})

test.group('OTP mixin | apply', () => {
  test('apply the mixin with a manager and no defaults', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withOTP({ manager })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    const code = await user.generateOTP()
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const [found] = await User.verifyOTP(user.id, code)
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })

  test('apply the mixin with a manager and defaults', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withOTP({ manager, purpose: 'signin' })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    const code = await user.generateOTP()
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'signin')

    const [found] = await User.verifyOTP(user.id, code)
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })
})

test.group('OTP mixin | resolve', () => {
  test('resolve the manager from a function on every call', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    /**
     * The manager does not exist yet when the model is defined, the
     * way a service is undefined until the application has booted
     */
    let current: OTPManager | undefined

    class User extends compose(BaseModel, withOTP({ manager: () => current! })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    current = createManager(db).manager
    const user = await User.create({ email: 'virk@adonisjs.com' })
    const code = await user.generateOTP()

    const [found] = await User.verifyOTP(user.id, code)
    assert.equal(found.id, user.id)
  })

  test('override the manager on the model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withOTP()) {
      static get $otpManager() {
        return manager
      }

      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    assert.strictEqual(User.$otpManager, manager)
    assert.strictEqual(new User().$otpManager, manager)
  })

  test('refuse to use the service before the application has booted', async ({ assert }) => {
    class User extends compose(BaseModel, withOTP()) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const error = await rejection<RuntimeException>(() => User.verifyOTP(1, '123456'))

    assert.instanceOf(error, RuntimeException)
    assert.match(error.message, /Cannot use the OTP manager before the application has booted/)
  })
})
