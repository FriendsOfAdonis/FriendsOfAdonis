import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { OTPManagerFactory } from '../../factories/otp.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { OTPManager, type OTPManagerConfig } from '../../modules/otp/manager.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'
import { SentinelToken } from '../../modules/token/token.ts'
import { freezeTime, rejection } from '../helpers.ts'

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
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup(config: OTPManagerConfig = {}) {
  const provider = new FakeMemoryTokenProvider()
  const hash = new HashManagerFactory<never>().create()
  const tokens = new TokenManagerFactory().withProvider(provider).withHash(hash).create()
  const manager = new OTPManagerFactory().withTokens(tokens).create(config)

  return { provider, hash, tokens, manager }
}

test.group('OTP manager | generateOTP', () => {
  test('create a numeric code of 6 digits by default', async ({ assert }) => {
    const { manager } = setup()
    const code = await manager.generateOTP(1)

    assert.instanceOf(code, Secret)
    assert.match(code.release(), /^\d{6}$/)
  })

  test('create a code of the length configured on the manager', async ({ assert }) => {
    const { manager } = setup({ length: 8 })
    const code = await manager.generateOTP(1)

    assert.match(code.release(), /^\d{8}$/)
  })

  test('give precedence to the length given at generation time', async ({ assert }) => {
    const { manager } = setup({ length: 8 })
    const code = await manager.generateOTP(1, { length: 4 })

    assert.match(code.release(), /^\d{4}$/)
  })

  test('create a random code every time', async ({ assert }) => {
    const { manager } = setup({ length: 32 })

    const first = await manager.generateOTP(1)
    const second = await manager.generateOTP(2)

    assert.notEqual(first.release(), second.release())
  })

  test('draw every digit from 0 to 9', async ({ assert }) => {
    const { manager } = setup()
    const code = await manager.generateOTP(1, { length: 1000 })

    assert.equal(new Set(code.release()).size, 10)
  })

  test('refuse a length of {length}')
    .with([{ length: 0 }, { length: -1 }, { length: 1.5 }, { length: Number.NaN }])
    .run(async ({ assert }, { length }) => {
      const { manager, provider } = setup()
      await manager.generateOTP(1)

      await assert.rejects(
        () => manager.generateOTP(1, { length }),
        RangeError,
        'length must be a positive integer'
      )

      /**
       * The length is checked before the pending code is replaced, so
       * the pending code survives
       */
      assert.lengthOf(provider.tokens, 1)
    })

  test('persist the scrypt hash of the code only', async ({ assert }) => {
    const { manager, provider, hash } = setup()
    const code = await manager.generateOTP(1)

    assert.lengthOf(provider.tokens, 1)

    const [persisted] = provider.tokens
    assert.instanceOf(persisted, SentinelToken)
    assert.equal(persisted.tokenableId, 1)
    assert.equal(persisted.kind, 'otp')
    assert.equal(persisted.kind, OTPManager.TOKEN_KIND)
    assert.match(persisted.hash, SCRYPT_HASH)
    assert.isTrue(await hash.use('scrypt').verify(persisted.hash, code.release()))
    assert.notInclude(JSON.stringify(persisted), code.release())
  })

  test('create a single use code locked after 5 failed attempts by default', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateOTP(1)

    const [token] = provider.tokens
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.equal(token.failedAttemptsCount, 0)
    assert.equal(token.maximumFailedAttemptsCount, 5)
    assert.isNull(token.name)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
  })

  test('lock the code after the failed attempts configured on the manager', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 3 })
    await manager.generateOTP(1)

    assert.equal(provider.tokens[0].maximumFailedAttemptsCount, 3)
  })

  test('give precedence to the failed attempts given at generation time', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 3 })
    await manager.generateOTP(1, { maximumFailedAttempts: 10 })

    assert.equal(provider.tokens[0].maximumFailedAttemptsCount, 10)
  })

  test('expire the code after 20 minutes by default', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    await manager.generateOTP(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 20 * 60))
  })

  test('expire the code after the lifetime configured on the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateOTP(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 60 * 60))
  })

  test('accept the lifetime in seconds', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: 90 })
    await manager.generateOTP(1)
    await manager.generateOTP(2, { expiresIn: 30 })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 90))
    assert.deepEqual(provider.tokens[1].expiresAt, after(NOW, 30))
  })

  test('give precedence to the lifetime given at generation time', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateOTP(1, { expiresIn: '5m' })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 5 * 60))
  })

  test('persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateOTP('user-1', {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
    })

    const [token] = provider.tokens
    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.purpose, 'signin')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })

  test('hide the code from the logs', async ({ assert }) => {
    const { manager } = setup()
    const code = await manager.generateOTP(1)

    assert.notInclude(`${code}`, code.release())
    assert.notInclude(JSON.stringify({ code }), code.release())
  })

  test('replace the pending code of the subject', async ({ assert }) => {
    const { manager, provider } = setup()

    /**
     * A longer first code, so that the two cannot collide
     */
    const first = await manager.generateOTP(1, { length: 8 })
    const [{ id: previous }] = provider.tokens

    const second = await manager.generateOTP(1)

    assert.lengthOf(provider.tokens, 1)
    assert.notEqual(provider.tokens[0].id, previous)

    await assert.rejects(() => manager.verifyOTP(1, first), E_INVALID_TOKEN)
    assert.equal((await manager.verifyOTP(1, second)).tokenableId, 1)
  })

  test('replace the pending code of the same purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateOTP(1)
    await manager.generateOTP(1, { purpose: 'signin' })
    await manager.generateOTP(1, { purpose: 'signup' })
    await manager.generateOTP(2, { purpose: 'signin' })

    await manager.generateOTP(1, { purpose: 'signin' })

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.purpose]),
      [
        [1, null],
        [1, 'signup'],
        [2, 'signin'],
        [1, 'signin'],
      ]
    )
  })

  test('replace the pending code without purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateOTP(1)
    await manager.generateOTP(1, { purpose: 'signin' })

    await manager.generateOTP(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.purpose),
      ['signin', null]
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await tokens.create(1, new Secret('magic-link-token'), { kind: 'magic_link' })
    await manager.generateOTP(1)
    await manager.generateOTP(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.kind),
      ['magic_link', 'otp']
    )
  })

  test('refuse to generate a code without a scrypt hasher', async ({ assert }) => {
    const provider = new FakeMemoryTokenProvider()
    /**
     * A hash manager without any hasher, as a "config/hash.ts" file
     * missing the scrypt one
     */
    const hash = new HashManagerFactory<never>({ list: {} as never }).create()
    const tokens = new TokenManagerFactory().withProvider(provider).withHash(hash).create()
    const manager = new OTPManagerFactory().withTokens(tokens).create()

    await assert.rejects(
      () => manager.generateOTP(1),
      RuntimeException,
      /Cannot hash tokens with "scrypt"/
    )
    assert.isEmpty(provider.tokens)
  })
})

test.group('OTP manager | verifyOTP', () => {
  test('verify the code and consume it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1, { metadata: { redirect: '/dashboard' } })

    const token = await manager.verifyOTP(1, code)

    assert.instanceOf(token, SentinelToken)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, OTPManager.TOKEN_KIND)
    assert.equal(token.usageCount, 1)
    assert.isTrue(token.isExhausted())
    assert.deepEqual(token.lastUsedAt, NOW)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('accept the code as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    const token = await manager.verifyOTP(1, code.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('verify the code against the purpose it was generated for', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP('user-1', { purpose: 'signin' })

    const token = await manager.verifyOTP('user-1', code, { purpose: 'signin' })

    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })

  test('accept the code until it expires', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '20m' })
    const code = await manager.generateOTP(1)

    freezeTime(after(NOW, 20 * 60))
    const token = await manager.verifyOTP(1, code)

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an expired code and remove it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '20m' })
    const code = await manager.generateOTP(1)

    freezeTime(after(NOW, 20 * 60 + 1))
    await assert.rejects(() => manager.verifyOTP(1, code), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a wrong code and count the attempt', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1, { purpose: 'signin' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyOTP(1, wrongCode(code), { purpose: 'signin' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 1)
  })

  test('accept the right code after wrong attempts short of the maximum', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 3 })
    const code = await manager.generateOTP(1)

    await assert.rejects(() => manager.verifyOTP(1, wrongCode(code)), E_INVALID_TOKEN)
    await assert.rejects(() => manager.verifyOTP(1, wrongCode(code)), E_INVALID_TOKEN)

    const token = await manager.verifyOTP(1, code)

    assert.equal(token.tokenableId, 1)
    assert.equal(token.failedAttemptsCount, 2)
    assert.isEmpty(provider.tokens)
  })

  test('lock the code once the wrong attempts reach the maximum', async ({ assert }) => {
    const { manager, provider } = setup({ maximumFailedAttempts: 3 })
    const code = await manager.generateOTP(1)
    const wrong = wrongCode(code)

    for (const attempt of [1, 2]) {
      const error = await rejection(() => manager.verifyOTP(1, wrong))
      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(provider.tokens[0].failedAttemptsCount, attempt)
    }

    const error = await rejection<TooManyAttemptsException>(() => manager.verifyOTP(1, wrong))

    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.status, 429)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)
    assert.isUndefined(error.purpose)

    /**
     * The locked code is removed, so the right one is refused as
     * unknown from now on
     */
    assert.isEmpty(provider.tokens)
    const refused = await rejection(() => manager.verifyOTP(1, code))
    assert.instanceOf(refused, E_INVALID_TOKEN)
    assert.notInstanceOf(refused, E_TOO_MANY_ATTEMPTS)
  })

  test('lock the code after 5 wrong attempts by default', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)
    const wrong = wrongCode(code)

    for (let attempt = 1; attempt < 5; attempt++) {
      const error = await rejection(() => manager.verifyOTP(1, wrong))
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(provider.tokens[0].failedAttemptsCount, attempt)
    }

    await assert.rejects(() => manager.verifyOTP(1, wrong), E_TOO_MANY_ATTEMPTS)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a code {mismatch} without counting an attempt')
    .with([
      {
        mismatch: 'generated with a purpose and verified without',
        created: 'signin',
        verified: undefined,
      },
      { mismatch: 'generated for another purpose', created: 'signin', verified: 'signup' },
      {
        mismatch: 'generated without purpose and verified with one',
        created: undefined,
        verified: 'signin',
      },
    ])
    .run(async ({ assert }, { created, verified }) => {
      const { manager, provider } = setup()
      const code = await manager.generateOTP(1, { purpose: created })

      const error = await rejection<InvalidTokenException>(() =>
        manager.verifyOTP(1, code, { purpose: verified })
      )

      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(error.kind, OTPManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)

      /**
       * The lookup is narrowed to the purpose, so the code of another
       * purpose is never a candidate the attempt is counted against
       */
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
      assert.equal(provider.tokens[0].failedAttemptsCount, 0)
    })

  test('refuse a code already used', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    await manager.verifyOTP(1, code)
    await assert.rejects(() => manager.verifyOTP(1, code), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a code for a subject without pending code', async ({ assert }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    const error = await rejection<InvalidTokenException>(() => manager.verifyOTP(2, code))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('refuse the code of another subject and count the attempt against its own code', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    const code = await manager.generateOTP(1)

    /**
     * A longer code, so that the two cannot collide
     */
    await manager.generateOTP(2, { length: 8 })

    await assert.rejects(() => manager.verifyOTP(2, code), E_INVALID_TOKEN)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.failedAttemptsCount]),
      [
        [1, 0],
        [2, 1],
      ]
    )

    assert.equal((await manager.verifyOTP(1, code)).tokenableId, 1)
  })

  test('refuse a token of another kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('123456')
    await tokens.create(1, value, { kind: 'magic_link', hasher: 'scrypt' })

    const error = await rejection<InvalidTokenException>(() => manager.verifyOTP(1, value))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, OTPManager.TOKEN_KIND)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })
})

test.group('OTP manager | invalidateOTPs', () => {
  test('invalidate the codes without purpose by default', async ({ assert }) => {
    const { manager, provider } = setup()
    const plain = await manager.generateOTP(1)
    const signin = await manager.generateOTP(1, { purpose: 'signin' })
    const foreign = await manager.generateOTP(2)

    await manager.invalidateOTPs(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.purpose]),
      [
        [1, 'signin'],
        [2, null],
      ]
    )

    await assert.rejects(() => manager.verifyOTP(1, plain), E_INVALID_TOKEN)
    assert.equal((await manager.verifyOTP(1, signin, { purpose: 'signin' })).purpose, 'signin')
    assert.equal((await manager.verifyOTP(2, foreign)).tokenableId, 2)
  })

  test('invalidate the codes of a purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateOTP(1)
    await manager.generateOTP(1, { purpose: 'signin' })
    await manager.generateOTP(1, { purpose: 'signup' })

    await manager.invalidateOTPs(1, { purpose: 'signin' })

    assert.deepEqual(
      provider.tokens.map((token) => token.purpose),
      [null, 'signup']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generateOTP(1)
    await tokens.create(1, new Secret('magic-link-token'), { kind: 'magic_link' })

    await manager.invalidateOTPs(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.kind),
      ['magic_link']
    )
  })
})
