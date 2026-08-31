import { test } from '@japa/runner'
import type { RecordId } from '../../../src/types.ts'
import { FakeMemoryTokenProvider } from '../../../modules/token/providers/fake.ts'
import { LucidTokenProvider } from '../../../modules/token/providers/lucid.ts'
import { SentinelToken } from '../../../modules/token/token.ts'
import type { TokenAttributes, TokenProviderContract } from '../../../modules/token/types.ts'
import { createDatabase, createTables, freezeTime } from '../../helpers.ts'

const NOW = new Date('2026-01-01T10:00:00.000Z')
const EXPIRES_AT = new Date('2026-01-01T10:20:00.000Z')

/**
 * Attributes of a single use token that never locks, unless
 * overridden
 */
function attributes(overrides: Partial<TokenAttributes> = {}): TokenAttributes {
  return {
    tokenableId: 1,
    kind: 'otp',
    hash: 'hash',
    name: null,
    purpose: null,
    maximumUsageCount: 1,
    maximumFailedAttemptsCount: null,
    metadata: null,
    expiresAt: EXPIRES_AT,
    ...overrides,
  }
}

/**
 * A provider under test, along with a way to list the primary keys
 * of the tokens it still holds
 */
interface Fixture {
  provider: TokenProviderContract
  ids: () => Promise<RecordId[]>
}

/**
 * Every provider must honor the same contract, so the same tests run
 * against each of them
 */
const fixtures: { name: string; setup: () => Promise<Fixture> }[] = [
  {
    name: 'Memory',
    setup: async () => {
      const provider = new FakeMemoryTokenProvider()
      return { provider, ids: async () => provider.tokens.map((token) => token.id) }
    },
  },
  {
    name: 'Lucid',
    setup: async () => {
      const db = await createDatabase()
      await createTables(db)

      return {
        provider: new LucidTokenProvider(db),
        ids: async () => {
          const rows = await db.from('sentinel_tokens').select('id').orderBy('id')
          return rows.map((row) => row.id)
        },
      }
    },
  },
]

for (const { name, setup } of fixtures) {
  test.group(`${name} token provider | create`, () => {
    test('persist the token and hand it back with its primary key', async ({ assert }) => {
      freezeTime(NOW)
      const { provider, ids } = await setup()

      const token = await provider.create(attributes({ hash: 'a' }))

      assert.instanceOf(token, SentinelToken)
      assert.exists(token.id)
      assert.equal(token.tokenableId, 1)
      assert.equal(token.kind, 'otp')
      assert.equal(token.hash, 'a')
      assert.isNull(token.name)
      assert.isNull(token.purpose)
      assert.equal(token.usageCount, 0)
      assert.equal(token.maximumUsageCount, 1)
      assert.equal(token.failedAttemptsCount, 0)
      assert.isNull(token.maximumFailedAttemptsCount)
      assert.isNull(token.metadata)
      assert.deepEqual(token.expiresAt, EXPIRES_AT)
      assert.isNull(token.lastUsedAt)
      assert.deepEqual(token.createdAt, NOW)

      assert.deepEqual(await ids(), [token.id])
    })

    test('assign a distinct primary key to every token', async ({ assert }) => {
      const { provider, ids } = await setup()

      const first = await provider.create(attributes({ hash: 'a' }))
      const second = await provider.create(attributes({ hash: 'b' }))

      assert.notEqual(first.id, second.id)
      assert.sameMembers(await ids(), [first.id, second.id])
    })

    test('persist the name, the purpose, the metadata and the budgets', async ({ assert }) => {
      const { provider } = await setup()

      const created = await provider.create(
        attributes({
          hash: 'a',
          name: 'Signin code',
          purpose: 'signin',
          maximumUsageCount: 3,
          maximumFailedAttemptsCount: 5,
          metadata: { redirect: '/dashboard', attempt: 2 },
        })
      )
      const found = await provider.findByHash('a', { kind: 'otp' })

      for (const token of [created, found!]) {
        assert.equal(token.name, 'Signin code')
        assert.equal(token.purpose, 'signin')
        assert.equal(token.maximumUsageCount, 3)
        assert.equal(token.maximumFailedAttemptsCount, 5)
        assert.deepEqual(token.metadata, { redirect: '/dashboard', attempt: 2 })
      }
    })
  })

  test.group(`${name} token provider | findByHash`, () => {
    test('find the token of the kind by its hash', async ({ assert }) => {
      const { provider } = await setup()
      await provider.create(attributes({ hash: 'a' }))
      const created = await provider.create(attributes({ hash: 'b', tokenableId: 2 }))

      const found = await provider.findByHash('b', { kind: 'otp' })

      assert.instanceOf(found, SentinelToken)
      assert.equal(found!.id, created.id)
      assert.equal(found!.tokenableId, 2)
    })

    test('return null for an unknown hash', async ({ assert }) => {
      const { provider } = await setup()
      await provider.create(attributes({ hash: 'a' }))

      assert.isNull(await provider.findByHash('b', { kind: 'otp' }))
    })

    test('return null when the hash belongs to a token of another kind', async ({ assert }) => {
      const { provider } = await setup()
      await provider.create(attributes({ hash: 'a', kind: 'otp' }))

      assert.isNull(await provider.findByHash('a', { kind: 'magic_link' }))
    })
  })

  test.group(`${name} token provider | findByTokenableId`, () => {
    test('find the tokens of the subject without purpose', async ({ assert }) => {
      const { provider } = await setup()
      const first = await provider.create(attributes({ hash: 'a' }))
      const second = await provider.create(attributes({ hash: 'b' }))
      await provider.create(attributes({ hash: 'c', purpose: 'signin' }))
      await provider.create(attributes({ hash: 'd', kind: 'magic_link' }))
      await provider.create(attributes({ hash: 'e', tokenableId: 2 }))

      const found = await provider.findByTokenableId(1, { kind: 'otp', purpose: null })

      assert.sameMembers(
        found.map((token) => token.id),
        [first.id, second.id]
      )
      found.forEach((token) => assert.instanceOf(token, SentinelToken))
    })

    test('find the tokens of the subject of a purpose', async ({ assert }) => {
      const { provider } = await setup()
      await provider.create(attributes({ hash: 'a' }))
      const signin = await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
      await provider.create(attributes({ hash: 'c', purpose: 'signup' }))
      await provider.create(attributes({ hash: 'd', kind: 'magic_link', purpose: 'signin' }))
      await provider.create(attributes({ hash: 'e', tokenableId: 2, purpose: 'signin' }))

      const found = await provider.findByTokenableId(1, { kind: 'otp', purpose: 'signin' })

      assert.deepEqual(
        found.map((token) => token.id),
        [signin.id]
      )
    })

    test('return an empty list for a subject without tokens', async ({ assert }) => {
      const { provider } = await setup()
      await provider.create(attributes({ hash: 'a' }))

      assert.deepEqual(await provider.findByTokenableId(2, { kind: 'otp', purpose: null }), [])
    })
  })

  test.group(`${name} token provider | markAsUsed`, () => {
    test('spend one usage and stamp the time', async ({ assert }) => {
      freezeTime(NOW)
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a', maximumUsageCount: 3 }))

      const used = await provider.markAsUsed(token)

      assert.instanceOf(used, SentinelToken)
      assert.equal(used!.id, token.id)
      assert.equal(used!.usageCount, 1)
      assert.deepEqual(used!.lastUsedAt, NOW)

      const found = await provider.findByHash('a', { kind: 'otp' })
      assert.equal(found!.usageCount, 1)
      assert.deepEqual(found!.lastUsedAt, NOW)
    })

    test('spend the usages one by one until the token is exhausted', async ({ assert }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a', maximumUsageCount: 3 }))

      for (const usage of [1, 2, 3]) {
        const used = await provider.markAsUsed(token)
        assert.equal(used!.usageCount, usage)
      }

      assert.isNull(await provider.markAsUsed(token))
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.usageCount, 3)
    })

    test('refuse to spend a usage of an exhausted token', async ({ assert }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a' }))

      assert.isNotNull(await provider.markAsUsed(token))
      assert.isNull(await provider.markAsUsed(token))
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.usageCount, 1)
    })

    test('grant the last usage to one of two concurrent calls only', async ({ assert }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a' }))

      const outcomes = await Promise.all([provider.markAsUsed(token), provider.markAsUsed(token)])

      assert.lengthOf(
        outcomes.filter((outcome) => outcome !== null),
        1
      )
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.usageCount, 1)
    })
  })

  test.group(`${name} token provider | recordFailedAttempt`, () => {
    test('count a failed attempt', async ({ assert }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a', maximumFailedAttemptsCount: 3 }))

      const updated = await provider.recordFailedAttempt(token)

      assert.instanceOf(updated, SentinelToken)
      assert.equal(updated!.id, token.id)
      assert.equal(updated!.failedAttemptsCount, 1)
      assert.equal(updated!.usageCount, 0)
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.failedAttemptsCount, 1)
    })

    test('count the failed attempts without limit when the token never locks', async ({
      assert,
    }) => {
      const { provider } = await setup()
      const token = await provider.create(
        attributes({ hash: 'a', maximumFailedAttemptsCount: null })
      )

      for (const attempt of [1, 2, 3, 4, 5]) {
        const updated = await provider.recordFailedAttempt(token)
        assert.equal(updated!.failedAttemptsCount, attempt)
        assert.isFalse(updated!.isLocked())
      }
    })

    test('count the failed attempts until the token is locked', async ({ assert }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a', maximumFailedAttemptsCount: 2 }))

      const first = await provider.recordFailedAttempt(token)
      assert.equal(first!.failedAttemptsCount, 1)
      assert.isFalse(first!.isLocked())

      const second = await provider.recordFailedAttempt(token)
      assert.equal(second!.failedAttemptsCount, 2)
      assert.isTrue(second!.isLocked())

      assert.isNull(await provider.recordFailedAttempt(token))
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.failedAttemptsCount, 2)
    })

    test('count the last failed attempt for one of two concurrent calls only', async ({
      assert,
    }) => {
      const { provider } = await setup()
      const token = await provider.create(attributes({ hash: 'a', maximumFailedAttemptsCount: 1 }))

      const outcomes = await Promise.all([
        provider.recordFailedAttempt(token),
        provider.recordFailedAttempt(token),
      ])

      assert.lengthOf(
        outcomes.filter((outcome) => outcome !== null),
        1
      )
      assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.failedAttemptsCount, 1)
    })
  })

  test.group(`${name} token provider | invalidate`, () => {
    test('remove the token', async ({ assert }) => {
      const { provider, ids } = await setup()
      const first = await provider.create(attributes({ hash: 'a' }))
      const second = await provider.create(attributes({ hash: 'b' }))

      await provider.invalidate(first)

      assert.deepEqual(await ids(), [second.id])
      assert.isNull(await provider.findByHash('a', { kind: 'otp' }))
    })

    test('ignore a token already removed', async ({ assert }) => {
      const { provider, ids } = await setup()
      const token = await provider.create(attributes({ hash: 'a' }))

      await provider.invalidate(token)
      await provider.invalidate(token)

      assert.deepEqual(await ids(), [])
    })
  })

  test.group(`${name} token provider | invalidateByTokenableId`, () => {
    test('remove the tokens of the subject without purpose', async ({ assert }) => {
      const { provider, ids } = await setup()
      await provider.create(attributes({ hash: 'a' }))
      await provider.create(attributes({ hash: 'b' }))
      const signin = await provider.create(attributes({ hash: 'c', purpose: 'signin' }))
      const magicLink = await provider.create(attributes({ hash: 'd', kind: 'magic_link' }))
      const foreign = await provider.create(attributes({ hash: 'e', tokenableId: 2 }))

      await provider.invalidateByTokenableId(1, { kind: 'otp', purpose: null })

      assert.sameMembers(await ids(), [signin.id, magicLink.id, foreign.id])
    })

    test('remove the tokens of the subject of a purpose', async ({ assert }) => {
      const { provider, ids } = await setup()
      const plain = await provider.create(attributes({ hash: 'a' }))
      await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
      await provider.create(attributes({ hash: 'c', purpose: 'signin' }))
      const signup = await provider.create(attributes({ hash: 'd', purpose: 'signup' }))
      const magicLink = await provider.create(
        attributes({ hash: 'e', kind: 'magic_link', purpose: 'signin' })
      )
      const foreign = await provider.create(
        attributes({ hash: 'f', tokenableId: 2, purpose: 'signin' })
      )

      await provider.invalidateByTokenableId(1, { kind: 'otp', purpose: 'signin' })

      assert.sameMembers(await ids(), [plain.id, signup.id, magicLink.id, foreign.id])
    })
  })

  test.group(`${name} token provider | invalidateAllByTokenableId`, () => {
    test('remove the tokens of the subject whatever their purpose', async ({ assert }) => {
      const { provider, ids } = await setup()
      await provider.create(attributes({ hash: 'a' }))
      await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
      await provider.create(attributes({ hash: 'c', purpose: 'signup' }))
      const magicLink = await provider.create(attributes({ hash: 'd', kind: 'magic_link' }))
      const foreign = await provider.create(
        attributes({ hash: 'e', tokenableId: 2, purpose: 'signin' })
      )

      await provider.invalidateAllByTokenableId(1, { kind: 'otp' })

      assert.sameMembers(await ids(), [magicLink.id, foreign.id])
    })
  })
}
