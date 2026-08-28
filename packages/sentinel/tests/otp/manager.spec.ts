import { Secret } from '@adonisjs/core/helpers'
import { test } from '@japa/runner'
import { OTPManager, type OTPManagerConfig } from '../../modules/otp/manager.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { TokenManager } from '../../modules/token/manager.ts'
import { createHashManager } from '../helpers.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'

const TWENTY_MINUTES = 20 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

/**
 * Manager holding the given configuration, or none at all when "null"
 * is given.
 */
function setup(config: Partial<OTPManagerConfig> | null = {}) {
  const provider = new FakeMemoryTokenProvider()
  const tokens = new TokenManager(provider, createHashManager())
  const manager = new OTPManager(
    config === null ? undefined : { length: 6, expiresIn: '20m', maximumFailedAttempts: 5, ...config },
    tokens
  )

  return { provider, tokens, manager }
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

test.group('OTPManager | generateOTP', () => {
  test('should generate a numeric code of the configured length', async ({ assert }) => {
    const { manager, provider } = setup({ length: 8 })

    const code = await manager.generateOTP(1)

    assert.match(code.release(), /^\d{8}$/)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].kind, OTPManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].tokenableId, 1)
  })

  test('should persist the code hashed with scrypt', async ({ assert }) => {
    const { manager, provider, tokens } = setup()

    const code = await manager.generateOTP(1)

    assert.notEqual(provider.tokens[0].hash, code.release())
    assert.isTrue(await tokens.hasher('scrypt').verify(provider.tokens[0].hash, code.release()))
  })

  test('should apply the configured maximum failed attempts', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 3 })

    await manager.generateOTP(1)
    await manager.generateOTP(1, { maximumFailedAttempts: 1 })

    assert.deepEqual(
      provider.tokens.map((t) => t.maximumFailedAttemptsCount),
      [3, 1]
    )
  })

  test('should apply the given length over the configured one', async ({ assert }) => {
    const { manager } = setup({ length: 6 })

    const code = await manager.generateOTP(1, { length: 4 })

    assert.match(code.release(), /^\d{4}$/)
  })

  test('should throw for an invalid length')
    .with([0, -1, 2.5])
    .run(async ({ assert }, length) => {
      const { manager, provider } = setup()

      await assert.rejects(
        () => manager.generateOTP(1, { length }),
        RangeError,
        /^length must be a positive integer$/
      )
      assert.isEmpty(provider.tokens)
    })

  test('should generate a different code every time', async ({ assert }) => {
    const { manager } = setup({ length: 8 })

    const codes = new Set()
    for (let i = 0; i < 5; i++) {
      codes.add((await manager.generateOTP(1)).release())
    }

    assert.isAbove(codes.size, 1)
  })

  test('should apply the configured expiration', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '20m' })

    const before = Date.now()
    await manager.generateOTP(1)
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + TWENTY_MINUTES)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + TWENTY_MINUTES)
  })

  test('should apply the given expiration over the configured one', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '20m' })

    const before = Date.now()
    await manager.generateOTP(1, { expiresIn: '1h' })
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should apply the defaults when nothing is configured', async ({ assert }) => {
    const { manager, provider } = setup(null)

    const before = Date.now()
    const code = await manager.generateOTP(1)
    const after = Date.now()

    assert.lengthOf(code.release(), 6)
    assert.equal(provider.tokens[0].maximumFailedAttemptsCount, 5)
    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + TWENTY_MINUTES)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + TWENTY_MINUTES)
  })
})

test.group('OTPManager | verifyOTP', () => {
  test('should verify and consume the code', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1, { purpose: 'signin', metadata: { ip: '127.0.0.1' } })

    const token = await manager.verifyOTP(1, code, { purpose: 'signin' })

    assert.equal(token.tokenableId, 1)
    assert.deepEqual(token.metadata, { ip: '127.0.0.1' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the code as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    await manager.verifyOTP(1, code.release())

    assert.isEmpty(provider.tokens)
  })

  test('should reject a code generated for a different purpose')
    .with([
      { generated: 'signin', verified: undefined },
      { generated: 'signin', verified: 'signup' },
      { generated: undefined, verified: 'signin' },
    ])
    .run(async ({ assert }, { generated, verified }) => {
      const { manager, provider } = setup()
      const code = await manager.generateOTP(1, { purpose: generated })

      const error = await invalidToken(manager.verifyOTP(1, code, { purpose: verified }))

      assert.equal(error.kind, OTPManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
      assert.equal(provider.tokens[0].failedAttemptsCount, 0)
    })

  test('should reject the code of another subject', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    const error = await invalidToken(manager.verifyOTP(2, code))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('should reject a code that has already been used', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    await manager.verifyOTP(1, code)
    await invalidToken(manager.verifyOTP(1, code))

    assert.isEmpty(provider.tokens)
  })

  test('should reject and invalidate an expired code', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)
    provider.tokens[0].expiresAt = new Date(Date.now() - 1_000)

    await invalidToken(manager.verifyOTP(1, code))

    assert.isEmpty(provider.tokens)
  })

  test('should reject a token of a different kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('123456')
    await tokens.create(1, value, { kind: 'magic_link', hasher: 'scrypt' })

    const error = await invalidToken(manager.verifyOTP(1, value))

    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('should reject a wrong code and count the attempt', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    await invalidToken(manager.verifyOTP(1, wrongCode(code)))

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('should count a wrong code against every pending code of the subject', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)
    await manager.generateOTP(1)
    await manager.generateOTP(2)

    await invalidToken(manager.verifyOTP(1, wrongCode(code)))

    assert.deepEqual(
      provider.tokens.map((t) => t.failedAttemptsCount),
      [1, 1, 0]
    )
  })

  test('should invalidate the code after too many wrong attempts', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 2 })
    const code = await manager.generateOTP(1)

    const first = await invalidToken(manager.verifyOTP(1, wrongCode(code)))
    assert.notInstanceOf(first, E_TOO_MANY_ATTEMPTS)
    assert.lengthOf(provider.tokens, 1)

    const error = await invalidToken(manager.verifyOTP(1, wrongCode(code)))
    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.isEmpty(provider.tokens)

    assert.notInstanceOf(await invalidToken(manager.verifyOTP(1, code)), E_TOO_MANY_ATTEMPTS)
  })
})
