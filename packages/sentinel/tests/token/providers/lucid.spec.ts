import { test } from '@japa/runner'
import type { Database } from '@adonisjs/lucid/database'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { DEFAULT_TOKENS_TABLE_NAME } from '../../../modules/token/constants.ts'
import {
  LucidTokenProvider,
  type LucidTokenColumns,
} from '../../../modules/token/providers/lucid.ts'
import { TokenSchema } from '../../../modules/token/schema.ts'
import type { TokenAttributes } from '../../../modules/token/types.ts'
import { createDatabase, createTables, freezeTime } from '../../helpers.ts'

const NOW = new Date('2026-01-01T10:00:00.000Z')
const EXPIRES_AT = new Date('2026-01-01T10:20:00.000Z')

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

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
 * Database service whose query client hands the given result back
 * for every insert
 */
function databaseInserting(result: unknown[]) {
  const client = {
    table: () => ({ insert: () => ({ returning: async () => result }) }),
  }

  return { connection: () => client } as unknown as Database
}

/**
 * Provider persisting its tokens in a fresh database
 */
async function setup() {
  const db = await createDatabase()
  await createTables(db)

  return { db, provider: new LucidTokenProvider(db) }
}

test.group('Lucid token provider | configuration', () => {
  test('use the "sentinel_tokens" table by default', async ({ assert }) => {
    const { db, provider } = await setup()
    const token = await provider.create(attributes())

    assert.equal(DEFAULT_TOKENS_TABLE_NAME, 'sentinel_tokens')

    const rows = await db.from('sentinel_tokens')
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, token.id)
  })

  test('use the configured table', async ({ assert }) => {
    const { db } = await setup()
    await db.connection().schema.createTable('custom_tokens', (table) => {
      TokenSchema.configureTokensTable(table)
    })

    const provider = new LucidTokenProvider(db, { table: 'custom_tokens' })
    const token = await provider.create(attributes({ hash: 'a' }))

    assert.isEmpty(await db.from('sentinel_tokens'))
    assert.lengthOf(await db.from('custom_tokens'), 1)
    assert.equal((await provider.findByHash('a', { kind: 'otp' }))!.id, token.id)
  })

  test('resolve the query client of the configured connection', ({ assert }) => {
    const connections: (string | undefined)[] = []
    const db = {
      connection: (name?: string) => {
        connections.push(name)
        return {}
      },
    } as unknown as Database

    new LucidTokenProvider(db)
    new LucidTokenProvider(db, { connection: 'secondary' })

    assert.deepEqual(connections, [undefined, 'secondary'])
  })
})

test.group('Lucid token provider | persistence', () => {
  test('store the metadata as JSON', async ({ assert }) => {
    const { db, provider } = await setup()
    await provider.create(attributes({ hash: 'a', metadata: { redirect: '/dashboard' } }))
    await provider.create(attributes({ hash: 'b' }))

    const rows = await db.from('sentinel_tokens').orderBy('id')

    assert.equal(rows[0].metadata, '{"redirect":"/dashboard"}')
    assert.isNull(rows[1].metadata)
  })

  test('stamp the creation time', async ({ assert }) => {
    freezeTime(NOW)
    const { db, provider } = await setup()
    const token = await provider.create(attributes())

    const row = await db.from('sentinel_tokens').first()

    assert.deepEqual(token.createdAt, NOW)
    assert.deepEqual(new Date(row.created_at), NOW)
    assert.deepEqual(new Date(row.expires_at), EXPIRES_AT)
    assert.isNull(row.last_used_at)
  })

  test('map the row to a token', async ({ assert }) => {
    const { db, provider } = await setup()

    /**
     * Timestamps are inserted as numbers, as SQLite hands them back
     */
    await db.table('sentinel_tokens').insert({
      tokenable_id: 7,
      kind: 'otp',
      name: 'Signin code',
      purpose: 'signin',
      hash: 'a',
      usage_count: 2,
      maximum_usage_count: 3,
      failed_attempts_count: 1,
      maximum_failed_attempts_count: 5,
      metadata: '{"redirect":"/dashboard"}',
      expires_at: EXPIRES_AT.getTime(),
      last_used_at: NOW.getTime(),
      created_at: NOW.getTime(),
    })

    const token = await provider.findByHash('a', { kind: 'otp' })

    assert.exists(token!.id)
    assert.equal(token!.tokenableId, 7)
    assert.equal(token!.kind, 'otp')
    assert.equal(token!.name, 'Signin code')
    assert.equal(token!.purpose, 'signin')
    assert.equal(token!.hash, 'a')
    assert.equal(token!.usageCount, 2)
    assert.equal(token!.maximumUsageCount, 3)
    assert.equal(token!.failedAttemptsCount, 1)
    assert.equal(token!.maximumFailedAttemptsCount, 5)
    assert.deepEqual(token!.metadata, { redirect: '/dashboard' })
    assert.instanceOf(token!.expiresAt, Date)
    assert.deepEqual(token!.expiresAt, EXPIRES_AT)
    assert.instanceOf(token!.lastUsedAt, Date)
    assert.deepEqual(token!.lastUsedAt, NOW)
    assert.instanceOf(token!.createdAt, Date)
    assert.deepEqual(token!.createdAt, NOW)
  })

  test('keep the metadata a json column hands back already parsed', async ({ assert }) => {
    /**
     * The json and jsonb columns of Postgres hand the metadata back
     * as an object. The mapping is exercised directly, since SQLite
     * has no such column
     */
    class Provider extends LucidTokenProvider {
      map(row: LucidTokenColumns) {
        return this.tokenFromRow(row)
      }
    }

    const { db } = await setup()
    const token = new Provider(db).map({
      id: 1,
      tokenable_id: 1,
      kind: 'otp',
      name: null,
      purpose: null,
      hash: 'a',
      usage_count: 0,
      maximum_usage_count: 1,
      failed_attempts_count: 0,
      maximum_failed_attempts_count: null,
      metadata: { redirect: '/dashboard' },
      expires_at: EXPIRES_AT,
      last_used_at: null,
      created_at: NOW,
    })

    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })

  test('hand the tokens of a subject back newest first', async ({ assert }) => {
    const { provider } = await setup()

    freezeTime(NOW)
    const first = await provider.create(attributes({ hash: 'a' }))
    freezeTime(after(NOW, 1))
    const second = await provider.create(attributes({ hash: 'b' }))
    freezeTime(after(NOW, 2))
    const third = await provider.create(attributes({ hash: 'c' }))

    const found = await provider.findByTokenableId(1, { kind: 'otp', purpose: null })

    assert.deepEqual(
      found.map((token) => token.id),
      [third.id, second.id, first.id]
    )
  })

  test('hand back a fresh token, leaving the given one untouched', async ({ assert }) => {
    const { provider } = await setup()
    const token = await provider.create(attributes({ maximumFailedAttemptsCount: 3 }))

    const used = await provider.markAsUsed(token)
    const failed = await provider.recordFailedAttempt(token)

    assert.notStrictEqual(used, token)
    assert.notStrictEqual(failed, token)
    assert.equal(used!.usageCount, 1)
    assert.equal(failed!.failedAttemptsCount, 1)
    assert.equal(token.usageCount, 0)
    assert.equal(token.failedAttemptsCount, 0)
  })

  test('accept the primary key handed back {shape}')
    .with([
      { shape: 'as an object', result: [{ id: 7 }] },
      { shape: 'bare', result: [7] },
    ])
    .run(async ({ assert }, { result }) => {
      const provider = new LucidTokenProvider(databaseInserting(result))
      const token = await provider.create(attributes({ tokenableId: 2, hash: 'a' }))

      assert.equal(token.id, 7)
      assert.equal(token.tokenableId, 2)
      assert.equal(token.hash, 'a')
    })

  test('refuse an insert result {shape}')
    .with([
      { shape: 'without rows', result: [] },
      { shape: 'without primary key', result: [{}] },
    ])
    .run(async ({ assert }, { result }) => {
      const provider = new LucidTokenProvider(databaseInserting(result))

      await assert.rejects(
        () => provider.create(attributes()),
        RuntimeException,
        /Cannot save sentinel token/
      )
    })
})
