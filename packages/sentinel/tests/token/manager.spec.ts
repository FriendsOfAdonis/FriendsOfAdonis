import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { TokenManagerFactory } from '../../factories/token.ts'
import { DEFAULT_TOKEN_EXPIRES_IN, DEFAULT_TOKEN_HASHER } from '../../modules/token/constants.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { ScryptTokenHasher, Sha256TokenHasher } from '../../modules/token/hashers.ts'
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

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup(provider = new FakeMemoryTokenProvider()) {
  const hash = new HashManagerFactory<never>().create()
  const tokens = new TokenManagerFactory().withProvider(provider).withHash(hash).create()

  return { provider, hash, tokens }
}

/**
 * Provider refusing to count failed attempts, as if every token had
 * been locked by a concurrent verification
 */
class LockedTokensProvider extends FakeMemoryTokenProvider {
  async recordFailedAttempt() {
    return null
  }
}

test.group('Token manager | hasher', () => {
  test('hash with sha256 by default', ({ assert }) => {
    const { tokens } = setup()

    assert.equal(DEFAULT_TOKEN_HASHER, 'sha256')
    assert.instanceOf(tokens.hasher(), Sha256TokenHasher)
    assert.instanceOf(tokens.hasher('sha256'), Sha256TokenHasher)
  })

  test('create the scrypt hasher from the hash manager', async ({ assert }) => {
    const { tokens, hash } = setup()
    const hasher = tokens.hasher('scrypt')

    assert.instanceOf(hasher, ScryptTokenHasher)

    const hashed = await hasher.make('123456')
    assert.match(hashed, SCRYPT_HASH)
    assert.isTrue(await hash.use('scrypt').verify(hashed, '123456'))
  })

  test('create every hasher once', ({ assert }) => {
    const { tokens } = setup()

    assert.strictEqual(tokens.hasher('sha256'), tokens.hasher('sha256'))
    assert.strictEqual(tokens.hasher(), tokens.hasher('sha256'))
    assert.strictEqual(tokens.hasher('scrypt'), tokens.hasher('scrypt'))
    assert.notStrictEqual(tokens.hasher('sha256'), tokens.hasher('scrypt'))
  })

  test('refuse the scrypt hasher when the hash manager has none', ({ assert }) => {
    /**
     * A hash manager without any hasher, as a "config/hash.ts" file
     * missing the scrypt one
     */
    const hash = new HashManagerFactory<never>({ list: {} as never }).create()
    const tokens = new TokenManagerFactory().withHash(hash).create()

    assert.throws(() => tokens.hasher('scrypt'), /Cannot hash tokens with "scrypt"/)
    assert.throws(() => tokens.hasher('scrypt'), RuntimeException)
  })

  test('refuse an unknown hasher', ({ assert }) => {
    const { tokens } = setup()

    assert.throws(() => tokens.hasher('md5' as never), 'Unknown token hasher "md5"')
    assert.throws(() => tokens.hasher('md5' as never), RuntimeException)
  })
})

test.group('Token manager | create', () => {
  test('persist the sha256 hash of the value only', async ({ assert }) => {
    const { tokens, provider } = setup()
    const token = await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    assert.instanceOf(token, SentinelToken)
    assert.lengthOf(provider.tokens, 1)
    assert.strictEqual(provider.tokens[0], token)

    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, 'otp')
    assert.equal(token.hash, sha256('secret'))
    assert.notInclude(JSON.stringify(token), 'secret')
  })

  test('create a single use token that never locks by default', async ({ assert }) => {
    const { tokens } = setup()
    const token = await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.equal(token.failedAttemptsCount, 0)
    assert.isNull(token.maximumFailedAttemptsCount)
    assert.isNull(token.name)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
    assert.isNull(token.lastUsedAt)
  })

  test('expire the token after 20 minutes by default', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens } = setup()
    const token = await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    assert.equal(DEFAULT_TOKEN_EXPIRES_IN, '20m')
    assert.deepEqual(token.createdAt, NOW)
    assert.deepEqual(token.expiresAt, after(NOW, 20 * 60))
  })

  test('accept the lifetime as a duration string', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens } = setup()
    const token = await tokens.create(1, new Secret('secret'), { kind: 'otp', expiresIn: '1h' })

    assert.deepEqual(token.expiresAt, after(NOW, 60 * 60))
  })

  test('accept the lifetime in seconds', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens } = setup()
    const token = await tokens.create(1, new Secret('secret'), { kind: 'otp', expiresIn: 90 })

    assert.deepEqual(token.expiresAt, after(NOW, 90))
  })

  test('persist the name, the purpose and the metadata', async ({ assert }) => {
    const { tokens } = setup()
    const token = await tokens.create('user-1', new Secret('secret'), {
      kind: 'magic_link',
      name: 'Signin link',
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
    })

    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.kind, 'magic_link')
    assert.equal(token.name, 'Signin link')
    assert.equal(token.purpose, 'signin')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })

  test('persist the usages and failed attempts budgets', async ({ assert }) => {
    const { tokens } = setup()
    const token = await tokens.create(1, new Secret('secret'), {
      kind: 'otp',
      maximumUsage: 3,
      maximumFailedAttempts: 5,
    })

    assert.equal(token.maximumUsageCount, 3)
    assert.equal(token.maximumFailedAttemptsCount, 5)
  })

  test('hash the value with scrypt when asked', async ({ assert }) => {
    const { tokens, hash } = setup()
    const token = await tokens.create(1, new Secret('123456'), { kind: 'otp', hasher: 'scrypt' })

    assert.match(token.hash, SCRYPT_HASH)
    assert.isTrue(await hash.use('scrypt').verify(token.hash, '123456'))
    assert.notInclude(JSON.stringify(token), '123456')
  })

  test('refuse to hash with scrypt when the hash manager has none', async ({ assert }) => {
    const provider = new FakeMemoryTokenProvider()
    const hash = new HashManagerFactory<never>({ list: {} as never }).create()
    const tokens = new TokenManagerFactory().withProvider(provider).withHash(hash).create()

    await assert.rejects(
      () => tokens.create(1, new Secret('123456'), { kind: 'otp', hasher: 'scrypt' }),
      RuntimeException,
      /Cannot hash tokens with "scrypt"/
    )
    assert.isEmpty(provider.tokens)
  })
})

test.group('Token manager | verify', () => {
  test('verify the value and consume the token', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), {
      kind: 'otp',
      metadata: { redirect: '/dashboard' },
    })

    const token = await tokens.verify(new Secret('secret'), { kind: 'otp' })

    assert.instanceOf(token, SentinelToken)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, 'otp')
    assert.equal(token.usageCount, 1)
    assert.isTrue(token.isExhausted())
    assert.deepEqual(token.lastUsedAt, NOW)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('find the token by its hash', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp' })
    await tokens.create(2, new Secret('second'), { kind: 'otp' })

    const token = await tokens.verify(new Secret('second'), { kind: 'otp' })

    assert.equal(token.tokenableId, 2)
    assert.deepEqual(
      provider.tokens.map((remaining) => remaining.tokenableId),
      [1]
    )
  })

  test('find the token among those of the subject when given', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp' })
    await tokens.create(2, new Secret('second'), { kind: 'otp' })

    const token = await tokens.verify(new Secret('second'), { kind: 'otp', tokenableId: 2 })

    assert.equal(token.tokenableId, 2)
    assert.deepEqual(
      provider.tokens.map((remaining) => remaining.tokenableId),
      [1]
    )
  })

  test('refuse the value of another subject when narrowed to one', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    const error = await rejection<InvalidTokenException>(() =>
      tokens.verify(new Secret('secret'), { kind: 'otp', tokenableId: 2 })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.kind, 'otp')

    /**
     * The other subject has no token the attempt could be counted
     * against, and the token of the right subject is left untouched
     */
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('spend one usage of a multi use token per verification', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumUsage: 3 })

    for (const usage of [1, 2]) {
      const token = await tokens.verify(new Secret('secret'), { kind: 'otp' })
      assert.equal(token.usageCount, usage)
      assert.isFalse(token.isExhausted())
      assert.lengthOf(provider.tokens, 1)
    }

    /**
     * The token is removed once its last usage is spent
     */
    const last = await tokens.verify(new Secret('secret'), { kind: 'otp' })
    assert.equal(last.usageCount, 3)
    assert.isTrue(last.isExhausted())
    assert.isEmpty(provider.tokens)

    await assert.rejects(
      () => tokens.verify(new Secret('secret'), { kind: 'otp' }),
      E_INVALID_TOKEN
    )
  })

  test('verify a scrypt token through its subject', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('123456'), { kind: 'otp', hasher: 'scrypt' })

    const token = await tokens.verify(new Secret('123456'), {
      kind: 'otp',
      hasher: 'scrypt',
      tokenableId: 1,
    })

    assert.equal(token.tokenableId, 1)
    assert.equal(token.usageCount, 1)
    assert.isEmpty(provider.tokens)
  })

  test('refuse to verify a scrypt token by value', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('123456'), { kind: 'otp', hasher: 'scrypt' })

    await assert.rejects(
      () => tokens.verify(new Secret('123456'), { kind: 'otp', hasher: 'scrypt' }),
      RuntimeException,
      /Cannot verify "otp" tokens by value/
    )

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('verify the token with the hasher it was created with only', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('123456'), { kind: 'otp', maximumFailedAttempts: 3 })

    /**
     * The sha256 hash is not a scrypt one, so the value does not
     * match and the attempt is counted
     */
    await assert.rejects(
      () => tokens.verify(new Secret('123456'), { kind: 'otp', hasher: 'scrypt', tokenableId: 1 }),
      E_INVALID_TOKEN
    )

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 1)
  })

  test('accept the token until it expires', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', expiresIn: '20m' })

    freezeTime(after(NOW, 20 * 60))
    const token = await tokens.verify(new Secret('secret'), { kind: 'otp' })

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an expired token and remove it', async ({ assert }) => {
    freezeTime(NOW)
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', expiresIn: '20m' })

    freezeTime(after(NOW, 20 * 60 + 1))
    const error = await rejection<InvalidTokenException>(() =>
      tokens.verify(new Secret('secret'), { kind: 'otp' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an unknown value', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', purpose: 'signin' })

    const error = await rejection<InvalidTokenException>(() =>
      tokens.verify(new Secret('unknown'), { kind: 'otp', purpose: 'signin' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, 'otp')
    assert.equal(error.purpose, 'signin')

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('refuse a token of another kind', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    const error = await rejection<InvalidTokenException>(() =>
      tokens.verify(new Secret('secret'), { kind: 'magic_link' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, 'magic_link')
    assert.isUndefined(error.purpose)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('refuse a token of another kind when narrowed to a subject', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumFailedAttempts: 3 })

    await assert.rejects(
      () => tokens.verify(new Secret('secret'), { kind: 'magic_link', tokenableId: 1 }),
      E_INVALID_TOKEN
    )

    /**
     * The lookup is narrowed to the kind, so the token of another kind
     * is never a candidate the attempt is counted against
     */
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('verify the token against the purpose it was created with', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', purpose: 'signin' })

    const token = await tokens.verify(new Secret('secret'), { kind: 'otp', purpose: 'signin' })

    assert.equal(token.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })

  test('refuse a token {mismatch}')
    .with([
      {
        mismatch: 'created with a purpose and verified without',
        created: 'signin',
        verified: undefined,
      },
      { mismatch: 'created for another purpose', created: 'signin', verified: 'signup' },
      {
        mismatch: 'created without purpose and verified with one',
        created: undefined,
        verified: 'signin',
      },
    ])
    .run(async ({ assert }, { created, verified }) => {
      const { tokens, provider } = setup()
      await tokens.create(1, new Secret('secret'), {
        kind: 'otp',
        purpose: created,
        maximumFailedAttempts: 3,
      })

      const error = await rejection<InvalidTokenException>(() =>
        tokens.verify(new Secret('secret'), { kind: 'otp', purpose: verified })
      )

      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(error.kind, 'otp')
      assert.equal(error.purpose, verified)

      /**
       * The token is found by its hash but refused for its purpose,
       * without being consumed nor counted as a failed attempt
       */
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
      assert.equal(provider.tokens[0].failedAttemptsCount, 0)
    })

  test('never count a value of another purpose against the tokens of the subject', async ({
    assert,
  }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), {
      kind: 'otp',
      purpose: 'signin',
      maximumFailedAttempts: 3,
    })

    await assert.rejects(
      () => tokens.verify(new Secret('secret'), { kind: 'otp', purpose: 'signup', tokenableId: 1 }),
      E_INVALID_TOKEN
    )
    await assert.rejects(
      () => tokens.verify(new Secret('secret'), { kind: 'otp', tokenableId: 1 }),
      E_INVALID_TOKEN
    )

    /**
     * The lookup is narrowed to the purpose, so the token of another
     * purpose is never a candidate the attempt is counted against
     */
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
  })

  test('refuse a token already used', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    await tokens.verify(new Secret('secret'), { kind: 'otp' })
    await assert.rejects(
      () => tokens.verify(new Secret('secret'), { kind: 'otp' }),
      E_INVALID_TOKEN
    )
    assert.isEmpty(provider.tokens)
  })

  test('refuse an exhausted token left behind and remove it', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    /**
     * A concurrent verification spent the last usage, but did not
     * remove the token yet
     */
    provider.tokens[0].usageCount = 1

    const error = await rejection<InvalidTokenException>(() =>
      tokens.verify(new Secret('secret'), { kind: 'otp' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.isEmpty(provider.tokens)
  })

  test('count a wrong value against every token of the subject', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp', maximumFailedAttempts: 3 })
    await tokens.create(1, new Secret('second'), { kind: 'otp', maximumFailedAttempts: 3 })
    await tokens.create(1, new Secret('third'), {
      kind: 'otp',
      purpose: 'signin',
      maximumFailedAttempts: 3,
    })
    await tokens.create(1, new Secret('fourth'), { kind: 'magic_link', maximumFailedAttempts: 3 })
    await tokens.create(2, new Secret('fifth'), { kind: 'otp', maximumFailedAttempts: 3 })

    await assert.rejects(
      () => tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 }),
      E_INVALID_TOKEN
    )

    /**
     * Only the tokens of the subject matching the kind and purpose
     * are candidates
     */
    assert.deepEqual(
      provider.tokens.map((token) => token.failedAttemptsCount),
      [1, 1, 0, 0, 0]
    )
  })

  test('never lock a token looked up by its hash', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumFailedAttempts: 1 })

    /**
     * A wrong value matches no hash, so there is no token the attempt
     * could be counted against
     */
    for (let attempt = 0; attempt < 3; attempt++) {
      const error = await rejection(() => tokens.verify(new Secret('wrong'), { kind: 'otp' }))
      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    }

    assert.equal(provider.tokens[0].failedAttemptsCount, 0)
    assert.equal((await tokens.verify(new Secret('secret'), { kind: 'otp' })).tokenableId, 1)
  })

  test('accept the right value after wrong attempts short of the maximum', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumFailedAttempts: 3 })

    for (const attempt of [1, 2]) {
      const error = await rejection(() =>
        tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 })
      )
      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(provider.tokens[0].failedAttemptsCount, attempt)
    }

    const token = await tokens.verify(new Secret('secret'), { kind: 'otp', tokenableId: 1 })

    assert.equal(token.tokenableId, 1)
    assert.equal(token.failedAttemptsCount, 2)
    assert.isEmpty(provider.tokens)
  })

  test('never lock a token without failed attempts budget', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp' })

    for (let attempt = 1; attempt <= 10; attempt++) {
      const error = await rejection(() =>
        tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 })
      )
      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(provider.tokens[0].failedAttemptsCount, attempt)
    }

    const token = await tokens.verify(new Secret('secret'), { kind: 'otp', tokenableId: 1 })

    assert.equal(token.failedAttemptsCount, 10)
    assert.isEmpty(provider.tokens)
  })

  test('lock the token once the wrong attempts reach the maximum', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), {
      kind: 'otp',
      purpose: 'signin',
      maximumFailedAttempts: 3,
    })
    const options = { kind: 'otp', purpose: 'signin', tokenableId: 1 }

    for (const attempt of [1, 2]) {
      const error = await rejection(() => tokens.verify(new Secret('wrong'), options))
      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
      assert.equal(provider.tokens[0].failedAttemptsCount, attempt)
    }

    const error = await rejection<TooManyAttemptsException>(() =>
      tokens.verify(new Secret('wrong'), options)
    )

    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.status, 429)
    assert.equal(error.kind, 'otp')
    assert.equal(error.purpose, 'signin')

    /**
     * The locked token is removed, so the right value is refused as
     * unknown from now on
     */
    assert.isEmpty(provider.tokens)
    const refused = await rejection(() => tokens.verify(new Secret('secret'), options))
    assert.instanceOf(refused, E_INVALID_TOKEN)
    assert.notInstanceOf(refused, E_TOO_MANY_ATTEMPTS)
  })

  test('lock every token of the subject exhausting its budget', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp', maximumFailedAttempts: 2 })
    await tokens.create(1, new Secret('second'), { kind: 'otp', maximumFailedAttempts: 2 })

    await assert.rejects(
      () => tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 }),
      E_INVALID_TOKEN
    )
    assert.deepEqual(
      provider.tokens.map((token) => token.failedAttemptsCount),
      [1, 1]
    )

    /**
     * The failed attempts budget bounds the guesses at both tokens,
     * so the next wrong value locks both
     */
    await assert.rejects(
      () => tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 }),
      E_TOO_MANY_ATTEMPTS
    )
    assert.isEmpty(provider.tokens)
  })

  test('refuse a locked token left behind and remove it', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumFailedAttempts: 3 })

    /**
     * A concurrent verification locked the token, but did not remove
     * it yet
     */
    provider.tokens[0].failedAttemptsCount = 3

    const error = await rejection<TooManyAttemptsException>(() =>
      tokens.verify(new Secret('secret'), { kind: 'otp', tokenableId: 1 })
    )

    assert.instanceOf(error, E_TOO_MANY_ATTEMPTS)
    assert.equal(error.kind, 'otp')
    assert.isEmpty(provider.tokens)
  })

  test('treat a failed attempt the provider refuses as a lock', async ({ assert }) => {
    const { tokens, provider } = setup(new LockedTokensProvider())
    await tokens.create(1, new Secret('secret'), { kind: 'otp', maximumFailedAttempts: 3 })

    await assert.rejects(
      () => tokens.verify(new Secret('wrong'), { kind: 'otp', tokenableId: 1 }),
      E_TOO_MANY_ATTEMPTS
    )
    assert.isEmpty(provider.tokens)
  })
})

test.group('Token manager | invalidate', () => {
  test('invalidate the tokens of the subject without purpose by default', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp' })
    await tokens.create(1, new Secret('second'), { kind: 'otp' })
    await tokens.create(1, new Secret('third'), { kind: 'otp', purpose: 'signin' })
    await tokens.create(1, new Secret('fourth'), { kind: 'magic_link' })
    await tokens.create(2, new Secret('fifth'), { kind: 'otp' })

    await tokens.invalidate(1, { kind: 'otp' })

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.kind, token.purpose]),
      [
        [1, 'otp', 'signin'],
        [1, 'magic_link', null],
        [2, 'otp', null],
      ]
    )
  })

  test('invalidate the tokens of the subject of a purpose only', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp' })
    await tokens.create(1, new Secret('second'), { kind: 'otp', purpose: 'signin' })
    await tokens.create(1, new Secret('third'), { kind: 'otp', purpose: 'signin' })
    await tokens.create(1, new Secret('fourth'), { kind: 'otp', purpose: 'signup' })
    await tokens.create(1, new Secret('fifth'), { kind: 'magic_link', purpose: 'signin' })
    await tokens.create(2, new Secret('sixth'), { kind: 'otp', purpose: 'signin' })

    await tokens.invalidate(1, { kind: 'otp', purpose: 'signin' })

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.kind, token.purpose]),
      [
        [1, 'otp', null],
        [1, 'otp', 'signup'],
        [1, 'magic_link', 'signin'],
        [2, 'otp', 'signin'],
      ]
    )
  })
})

test.group('Token manager | invalidateAll', () => {
  test('invalidate the tokens of the subject whatever their purpose', async ({ assert }) => {
    const { tokens, provider } = setup()
    await tokens.create(1, new Secret('first'), { kind: 'otp' })
    await tokens.create(1, new Secret('second'), { kind: 'otp', purpose: 'signin' })
    await tokens.create(1, new Secret('third'), { kind: 'otp', purpose: 'signup' })
    await tokens.create(1, new Secret('fourth'), { kind: 'magic_link' })
    await tokens.create(2, new Secret('fifth'), { kind: 'otp', purpose: 'signin' })

    await tokens.invalidateAll(1, { kind: 'otp' })

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.kind, token.purpose]),
      [
        [1, 'magic_link', null],
        [2, 'otp', 'signin'],
      ]
    )
  })
})
