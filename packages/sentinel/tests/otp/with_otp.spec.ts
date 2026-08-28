import { RuntimeException } from '@adonisjs/core/exceptions'
import { compose, Secret } from '@adonisjs/core/helpers'
import type { ApplicationService } from '@adonisjs/core/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { OTPManager } from '../../modules/otp/manager.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { createSentinelApp, MemoryTokenProvider, SENTINEL_CONFIG } from '../helpers.ts'
import { OTPManagerFactory } from '../../factories/otp.ts'
import { TokenManagerFactory } from '../../factories/token.ts'

const ONE_HOUR = 60 * 60 * 1000

/**
 * Model using the mixin with "signin" as the default purpose. The mixin
 * is handed over rather than imported because its module resolves the
 * sentinel service from the application booted at import time, see
 * "createSentinelApp".
 */
function defineUser(otp: OTPManager) {
  class User extends compose(BaseModel, otp.withOTP({ purpose: 'signin' })) {
    static table = 'users'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
}

/**
 * A code of the same length differing from the given one.
 */
function wrongCode(code: Secret<string>) {
  const digits = code.release()
  return digits.slice(0, -1) + ((Number(digits.at(-1)) + 1) % 10)
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

  throw new Error('Expected the OTP to be rejected')
}

test.group('withOTP', (group) => {
  let app: ApplicationService
  let provider: MemoryTokenProvider
  let User: ReturnType<typeof defineUser>

  group.setup(async () => {
    const sentinel = await createSentinelApp()
    app = sentinel.app
    provider = sentinel.provider

    const token = new TokenManagerFactory().withProvider(provider).create()
    const otp = new OTPManagerFactory().withTokens(token).create()
    User = defineUser(otp)
  })

  group.each.teardown(async () => {
    provider.tokens = []
    await User.query().delete()
  })

  group.teardown(() => app.terminate())

  test('should generate a code for the primary key of the model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const code = await user.generateOTP()

    assert.instanceOf(code, Secret)
    assert.match(code.release(), new RegExp(`^\\d{${SENTINEL_CONFIG.otp.length}}$`))
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].tokenableId, user.id)
    assert.equal(provider.tokens[0].kind, OTPManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].purpose, 'signin')
    assert.equal(
      provider.tokens[0].maximumFailedAttemptsCount,
      SENTINEL_CONFIG.otp.maximumFailedAttempts
    )
  })

  test('should override the defaults of the mixin with the given options', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const before = Date.now()
    const code = await user.generateOTP({
      length: 8,
      purpose: 'signup',
      metadata: { redirect: '/dashboard' },
      expiresIn: '1h',
      maximumFailedAttempts: 2,
    })
    const after = Date.now()

    assert.match(code.release(), /^\d{8}$/)
    assert.equal(provider.tokens[0].purpose, 'signup')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
    assert.equal(provider.tokens[0].maximumFailedAttemptsCount, 2)
    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should throw when the primary key is empty', async ({ assert }) => {
    const user = new User()

    await assert.rejects(
      () => user.generateOTP(),
      RuntimeException,
      /^Cannot generate an OTP for User \{.*\}: the primary key is empty$/s
    )
    assert.isEmpty(provider.tokens)
  })

  test('should verify the code and return the model instance', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyOTP(user.id, code)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'jane@example.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the code as a string', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP()

    const [found, metadata] = await User.verifyOTP(user.id, code.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(provider.tokens)
  })

  test('should verify the code with the default purpose of the mixin', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP({ purpose: 'signup' })

    const error = await invalidToken(User.verifyOTP(user.id, code))
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)

    const [found] = await User.verifyOTP(user.id, code, { purpose: 'signup' })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should drop the default purpose when the purpose option is undefined', async ({
    assert,
  }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP({ purpose: undefined })
    assert.isNull(provider.tokens[0].purpose)

    const error = await invalidToken(User.verifyOTP(user.id, code))
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)

    const [found] = await User.verifyOTP(user.id, code, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should reject a wrong code and count the attempt', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP()

    const error = await invalidToken(User.verifyOTP(user.id, wrongCode(code)))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('should reject the code of another model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const other = await User.create({ email: 'john@example.com' })
    const code = await user.generateOTP()

    await invalidToken(User.verifyOTP(other.id, code))

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('should invalidate the code after too many wrong attempts', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP({ maximumFailedAttempts: 1 })

    const error = await invalidToken(User.verifyOTP(user.id, wrongCode(code)))

    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })

  test('should reject the code when the model no longer exists', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const code = await user.generateOTP()
    await user.delete()

    const error = await invalidToken(User.verifyOTP(user.id, code))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })
})
