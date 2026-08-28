import { createHash } from 'node:crypto'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import { Secret } from '@adonisjs/core/helpers'
import { test } from '@japa/runner'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import { ScryptTokenHasher, Sha256TokenHasher } from '../../modules/token/hashers.ts'
import { TokenManager } from '../../modules/token/manager.ts'
import type { TokenHasher } from '../../modules/token/types.ts'
import { createHashManager } from '../helpers.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'

const KIND = 'magic_link'
const VALUE = new Secret('super-secret-token-value')
const SHA256 = createHash('sha256').update(VALUE.release()).digest('hex')

const TWENTY_MINUTES = 20 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

function setup() {
  const provider = new FakeMemoryTokenProvider()
  const manager = new TokenManager(provider, createHashManager())

  return { provider, manager }
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

  throw new Error('Expected the token to be rejected')
}

/**
 * Awaits a rejection with an "E_TOO_MANY_ATTEMPTS" error and returns it.
 */
async function tooManyAttempts(promise: Promise<unknown>) {
  const error = await invalidToken(promise)

  if (!(error instanceof E_TOO_MANY_ATTEMPTS)) {
    throw new Error('Expected the token to be rejected for too many attempts')
  }

  return error
}

test.group('TokenManager | hasher', () => {
  test('should default to the sha256 hasher', ({ assert }) => {
    const { manager } = setup()

    assert.instanceOf(manager.hasher(), Sha256TokenHasher)
    assert.instanceOf(manager.hasher('sha256'), Sha256TokenHasher)
  })

  test('should create the scrypt hasher from the hash service', ({ assert }) => {
    const { manager } = setup()

    assert.instanceOf(manager.hasher('scrypt'), ScryptTokenHasher)
  })

  test('should reuse hasher instances', ({ assert }) => {
    const { manager } = setup()

    assert.strictEqual(manager.hasher('sha256'), manager.hasher('sha256'))
    assert.strictEqual(manager.hasher('scrypt'), manager.hasher('scrypt'))
    assert.notStrictEqual(manager.hasher('sha256'), manager.hasher('scrypt'))
  })

  test('should throw when the scrypt hasher is not configured', ({ assert }) => {
    const hash = createHashManager({ custom: () => new Scrypt({}) })
    const manager = new TokenManager(new FakeMemoryTokenProvider(), hash)

    assert.throws(
      () => manager.hasher('scrypt'),
      'Cannot hash tokens with "scrypt". Make sure a "scrypt" hasher is defined inside the "config/hash.ts" file'
    )
  })

  test('should throw for an unknown hasher', ({ assert }) => {
    const { manager } = setup()

    assert.throws(() => manager.hasher('md5' as TokenHasher), 'Unknown token hasher "md5"')
  })
})

test.group('TokenManager | create', () => {
  test('should persist the hash of the value', async ({ assert }) => {
    const { manager, provider } = setup()

    const token = await manager.create(1, VALUE, { kind: KIND })

    assert.equal(token.hash, SHA256)
    assert.notEqual(token.hash, VALUE.release())
    assert.deepEqual(provider.tokens, [token])
  })

  test('should apply the defaults', async ({ assert }) => {
    const { manager } = setup()

    const before = Date.now()
    const token = await manager.create(1, VALUE, { kind: KIND })
    const after = Date.now()

    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, KIND)
    assert.isNull(token.name)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.equal(token.failedAttemptsCount, 0)
    assert.isNull(token.maximumFailedAttemptsCount)
    assert.isNull(token.lastUsedAt)
    assert.isAtLeast(token.expiresAt.getTime(), before + TWENTY_MINUTES)
    assert.isAtMost(token.expiresAt.getTime(), after + TWENTY_MINUTES)
  })

  test('should persist the given options', async ({ assert }) => {
    const { manager } = setup()

    const before = Date.now()
    const token = await manager.create('user-1', VALUE, {
      kind: KIND,
      name: 'login',
      purpose: 'signin',
      maximumUsage: 3,
      maximumFailedAttempts: 5,
      metadata: { ip: '127.0.0.1' },
      expiresIn: '1h',
    })
    const after = Date.now()

    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.name, 'login')
    assert.equal(token.purpose, 'signin')
    assert.equal(token.maximumUsageCount, 3)
    assert.equal(token.maximumFailedAttemptsCount, 5)
    assert.deepEqual(token.metadata, { ip: '127.0.0.1' })
    assert.isAtLeast(token.expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(token.expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should accept the expiration as a number of seconds', async ({ assert }) => {
    const { manager } = setup()

    const before = Date.now()
    const token = await manager.create(1, VALUE, { kind: KIND, expiresIn: 30 })
    const after = Date.now()

    assert.isAtLeast(token.expiresAt.getTime(), before + 30_000)
    assert.isAtMost(token.expiresAt.getTime(), after + 30_000)
  })

  test('should hash the value with the given hasher', async ({ assert }) => {
    const { manager } = setup()

    const token = await manager.create(1, VALUE, { kind: KIND, hasher: 'scrypt' })

    assert.notEqual(token.hash, SHA256)
    assert.isTrue(await manager.hasher('scrypt').verify(token.hash, VALUE.release()))
  })
})

test.group('TokenManager | verify', () => {
  test('should return the token matching the value', async ({ assert }) => {
    const { manager } = setup()
    const created = await manager.create(1, VALUE, { kind: KIND })

    const before = Date.now()
    const token = await manager.verify(VALUE, { kind: KIND })

    assert.equal(token.id, created.id)
    assert.equal(token.usageCount, 1)
    assert.instanceOf(token.lastUsedAt, Date)
    assert.isAtLeast(token.lastUsedAt!.getTime(), before)
  })

  test('should invalidate a single use token once used', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND })

    await manager.verify(VALUE, { kind: KIND })

    assert.isEmpty(provider.tokens)
    await invalidToken(manager.verify(VALUE, { kind: KIND }))
  })

  test('should allow a token to be used up to its maximum usage count', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND, maximumUsage: 3 })

    assert.equal((await manager.verify(VALUE, { kind: KIND })).usageCount, 1)
    assert.equal((await manager.verify(VALUE, { kind: KIND })).usageCount, 2)
    assert.lengthOf(provider.tokens, 1)

    assert.equal((await manager.verify(VALUE, { kind: KIND })).usageCount, 3)
    assert.isEmpty(provider.tokens)

    await invalidToken(manager.verify(VALUE, { kind: KIND }))
  })

  test('should throw when no token matches the value', async ({ assert }) => {
    const { manager, provider } = setup()
    const token = await manager.create(1, VALUE, { kind: KIND, purpose: 'signin' })

    const error = await invalidToken(
      manager.verify(new Secret('other-value'), { kind: KIND, purpose: 'signin' })
    )

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, KIND)
    assert.equal(error.purpose, 'signin')
    assert.equal(error.message, 'The provided token is either invalid or expired.')
    assert.deepEqual(provider.tokens, [token])
    assert.equal(token.usageCount, 0)
    assert.equal(token.failedAttemptsCount, 0)
  })

  test('should throw when the kind does not match', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND })

    const error = await invalidToken(manager.verify(VALUE, { kind: 'email_verification' }))

    assert.equal(error.kind, 'email_verification')
    assert.isUndefined(error.purpose)
    assert.lengthOf(provider.tokens, 1)
  })

  test('should throw when the purpose does not match')
    .with([
      { created: 'signin', verified: undefined },
      { created: 'signin', verified: 'signup' },
      { created: undefined, verified: 'signin' },
    ])
    .run(async ({ assert }, { created, verified }) => {
      const { manager, provider } = setup()
      await manager.create(1, VALUE, { kind: KIND, purpose: created })

      const error = await invalidToken(manager.verify(VALUE, { kind: KIND, purpose: verified }))

      assert.equal(error.purpose, verified)
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
    })

  test('should throw and invalidate an expired token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND })
    provider.tokens[0].expiresAt = new Date(Date.now() - 1_000)

    await invalidToken(manager.verify(VALUE, { kind: KIND }))

    assert.isEmpty(provider.tokens)
  })

  test('should throw and invalidate a token that can no longer be used', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND })
    provider.tokens[0].usageCount = 1

    await invalidToken(manager.verify(VALUE, { kind: KIND }))

    assert.isEmpty(provider.tokens)
  })

  test('should narrow the lookup to the given subject', async ({ assert }) => {
    const { manager, provider } = setup()
    const created = await manager.create(1, VALUE, { kind: KIND })

    await invalidToken(manager.verify(VALUE, { kind: KIND, tokenableId: 2 }))
    assert.lengthOf(provider.tokens, 1)

    const token = await manager.verify(VALUE, { kind: KIND, tokenableId: 1 })
    assert.equal(token.id, created.id)
  })

  test('should find the token among the tokens of the subject', async ({ assert }) => {
    const { manager } = setup()
    await manager.create(1, new Secret('first-value'), { kind: KIND })
    const second = await manager.create(1, new Secret('second-value'), { kind: KIND })
    await manager.create(1, new Secret('third-value'), { kind: KIND })

    const token = await manager.verify(new Secret('second-value'), { kind: KIND, tokenableId: 1 })

    assert.equal(token.id, second.id)
  })

  test('should verify a token hashed with scrypt by subject', async ({ assert }) => {
    const { manager, provider } = setup()
    const created = await manager.create(1, VALUE, { kind: KIND, hasher: 'scrypt' })

    const token = await manager.verify(VALUE, { kind: KIND, hasher: 'scrypt', tokenableId: 1 })

    assert.equal(token.id, created.id)
    assert.isEmpty(provider.tokens)
  })

  test('should refuse to verify a token hashed with scrypt by value', async ({ assert }) => {
    const { manager } = setup()
    await manager.create(1, VALUE, { kind: KIND, hasher: 'scrypt' })

    await assert.rejects(
      () => manager.verify(VALUE, { kind: KIND, hasher: 'scrypt' }),
      'Cannot verify "magic_link" tokens by value. The "scrypt" hasher is not deterministic, provide the "tokenableId" option to look the token up by its subject'
    )
  })

  test('should record a failed attempt on the tokens of the subject when none matches', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    await manager.create(1, new Secret('first-value'), { kind: KIND, maximumFailedAttempts: 3 })
    await manager.create(1, new Secret('second-value'), { kind: KIND, maximumFailedAttempts: 3 })
    await manager.create(2, VALUE, { kind: KIND, maximumFailedAttempts: 3 })

    await invalidToken(manager.verify(new Secret('wrong-value'), { kind: KIND, tokenableId: 1 }))

    assert.deepEqual(
      provider.tokens.map((t) => t.failedAttemptsCount),
      [1, 1, 0]
    )
  })

  test('should not record a failed attempt when a token of the subject matches', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    const first = await manager.create(1, new Secret('first-value'), {
      kind: KIND,
      maximumFailedAttempts: 3,
    })
    await manager.create(1, new Secret('second-value'), { kind: KIND, maximumFailedAttempts: 3 })

    await manager.verify(new Secret('second-value'), { kind: KIND, tokenableId: 1 })

    assert.deepEqual(provider.tokens, [first])
    assert.equal(first.failedAttemptsCount, 0)
  })

  test('should invalidate a token once its failed attempts reach the maximum', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    await manager.create(1, VALUE, { kind: KIND, purpose: 'signin', maximumFailedAttempts: 2 })
    const verify = (value: string) =>
      manager.verify(new Secret(value), { kind: KIND, purpose: 'signin', tokenableId: 1 })

    const first = await invalidToken(verify('wrong-value'))
    assert.notInstanceOf(first, E_TOO_MANY_ATTEMPTS)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].failedAttemptsCount, 1)

    const error = await tooManyAttempts(verify('wrong-value'))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.status, 429)
    assert.equal(error.kind, KIND)
    assert.equal(error.purpose, 'signin')
    assert.equal(error.message, 'Too many failed attempts, the token has been invalidated.')
    assert.isEmpty(provider.tokens)

    assert.notInstanceOf(await invalidToken(verify(VALUE.release())), E_TOO_MANY_ATTEMPTS)
  })

  test('should report too many attempts when any token of the subject locks', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    await manager.create(1, new Secret('first-value'), { kind: KIND, maximumFailedAttempts: 1 })
    const second = await manager.create(1, new Secret('second-value'), {
      kind: KIND,
      maximumFailedAttempts: 3,
    })

    await tooManyAttempts(manager.verify(new Secret('wrong-value'), { kind: KIND, tokenableId: 1 }))

    assert.deepEqual(provider.tokens, [second])
    assert.equal(second.failedAttemptsCount, 1)
  })

  test('should keep counting failed attempts on a token without a maximum', async ({ assert }) => {
    const { manager, provider } = setup()
    const created = await manager.create(1, VALUE, { kind: KIND })

    for (let attempt = 0; attempt < 2; attempt++) {
      const error = await invalidToken(
        manager.verify(new Secret('wrong-value'), { kind: KIND, tokenableId: 1 })
      )
      assert.notInstanceOf(error, E_TOO_MANY_ATTEMPTS)
    }

    assert.deepEqual(provider.tokens, [created])
    assert.equal(created.failedAttemptsCount, 2)
    assert.equal((await manager.verify(VALUE, { kind: KIND, tokenableId: 1 })).id, created.id)
  })

  test('should invalidate a locked token without using it', async ({ assert }) => {
    const { manager, provider } = setup()
    const created = await manager.create(1, VALUE, { kind: KIND, maximumFailedAttempts: 3 })
    created.failedAttemptsCount = 3

    await tooManyAttempts(manager.verify(VALUE, { kind: KIND, tokenableId: 1 }))

    assert.isEmpty(provider.tokens)
    assert.equal(created.usageCount, 0)
  })

  test('should verify a token while invalidating a locked token of the subject', async ({
    assert,
  }) => {
    const { manager, provider } = setup()
    const stale = await manager.create(1, new Secret('stale-value'), {
      kind: KIND,
      maximumFailedAttempts: 3,
    })
    stale.failedAttemptsCount = 3
    const created = await manager.create(1, VALUE, { kind: KIND, maximumFailedAttempts: 3 })

    const token = await manager.verify(VALUE, { kind: KIND, tokenableId: 1 })

    assert.equal(token.id, created.id)
    assert.isEmpty(provider.tokens)
  })

  test('should invalidate a token when the failed attempt cannot be recorded', async ({
    assert,
  }) => {
    const provider = new (class extends FakeMemoryTokenProvider {
      async recordFailedAttempt() {
        return null
      }
    })()
    const manager = new TokenManager(provider, createHashManager())
    await manager.create(1, VALUE, { kind: KIND, maximumFailedAttempts: 3 })

    await tooManyAttempts(manager.verify(new Secret('wrong-value'), { kind: KIND, tokenableId: 1 }))

    assert.isEmpty(provider.tokens)
  })
})

test.group('TokenManager | invalidate', () => {
  test('should invalidate the tokens of a subject', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.create(1, new Secret('a'), { kind: KIND })
    await manager.create(1, new Secret('b'), { kind: KIND, purpose: 'signin' })
    const otherKind = await manager.create(1, new Secret('c'), { kind: 'email_verification' })
    const otherSubject = await manager.create(2, new Secret('d'), { kind: KIND })

    await manager.invalidate(1, { kind: KIND })

    assert.deepEqual(provider.tokens, [otherKind, otherSubject])
  })

  test('should invalidate the tokens of a subject with the given purpose', async ({ assert }) => {
    const { manager, provider } = setup()
    const noPurpose = await manager.create(1, new Secret('a'), { kind: KIND })
    await manager.create(1, new Secret('b'), { kind: KIND, purpose: 'signin' })
    const signup = await manager.create(1, new Secret('c'), { kind: KIND, purpose: 'signup' })

    await manager.invalidate(1, { kind: KIND, purpose: 'signin' })
    assert.deepEqual(provider.tokens, [noPurpose, signup])

    await manager.invalidate(1, { kind: KIND, purpose: null })
    assert.deepEqual(provider.tokens, [signup])
  })
})
