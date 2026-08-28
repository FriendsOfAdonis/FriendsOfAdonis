import { configProvider } from '@adonisjs/core'
import type { ApplicationService } from '@adonisjs/core/types'
import type { Database } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import {
  LucidTokenProvider,
  type LucidTokenColumns,
} from '../../../modules/token/providers/lucid.ts'
import { SentinelToken } from '../../../modules/token/token.ts'
import type { TokenAttributes, TokenProviderContract } from '../../../modules/token/types.ts'
import { DEFAULT_TOKENS_TABLE_NAME } from '../../../modules/token/constants.ts'
import { tokens } from '../../../src/define_config.ts'
import { createDatabase, createTokensTable } from '../../helpers.ts'

const KIND = 'magic_link'
const CUSTOM_TABLE = 'custom_tokens'

function attributes(overrides: Partial<TokenAttributes> = {}): TokenAttributes {
  return {
    tokenableId: 1,
    kind: KIND,
    hash: 'hash',
    name: null,
    purpose: null,
    maximumUsageCount: 1,
    maximumFailedAttemptsCount: null,
    metadata: null,
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  }
}

function columns(overrides: Partial<LucidTokenColumns> = {}): LucidTokenColumns {
  return {
    id: 1,
    tokenable_id: 1,
    kind: KIND,
    name: null,
    purpose: null,
    hash: 'hash',
    usage_count: 0,
    maximum_usage_count: 1,
    failed_attempts_count: 0,
    maximum_failed_attempts_count: null,
    metadata: null,
    expires_at: new Date(Date.now() + 60_000),
    last_used_at: null,
    created_at: new Date(),
    ...overrides,
  }
}

/**
 * Exposes the row mapping of the provider.
 */
class ExposedTokenProvider extends LucidTokenProvider {
  fromRow(row: LucidTokenColumns) {
    return this.tokenFromRow(row)
  }
}

test.group('LucidTokenProvider', (group) => {
  let app: ApplicationService
  let db: Database
  let provider: LucidTokenProvider

  group.setup(async () => {
    const database = await createDatabase()
    app = database.app
    db = database.db

    await createTokensTable(db)
    await createTokensTable(db, CUSTOM_TABLE)
    await createTokensTable(db, DEFAULT_TOKENS_TABLE_NAME, 'secondary')

    provider = new LucidTokenProvider(db)
  })

  group.each.teardown(async () => {
    await db.from(DEFAULT_TOKENS_TABLE_NAME).delete()
    await db.from(CUSTOM_TABLE).delete()
    await db.connection('secondary').from(DEFAULT_TOKENS_TABLE_NAME).delete()
  })

  group.teardown(() => app.terminate())

  function rows(table: string = DEFAULT_TOKENS_TABLE_NAME, connection?: string) {
    return db.connection(connection).query<LucidTokenColumns>().from(table).orderBy('id')
  }

  test('should persist the token and return it', async ({ assert }) => {
    const expiresAt = new Date(Date.now() + 60_000)
    const before = Date.now()

    const token = await provider.create(
      attributes({
        name: 'login',
        purpose: 'signin',
        maximumUsageCount: 3,
        maximumFailedAttemptsCount: 5,
        metadata: { ip: '127.0.0.1' },
        expiresAt,
      })
    )

    assert.instanceOf(token, SentinelToken)
    assert.isNumber(token.id)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, KIND)
    assert.equal(token.name, 'login')
    assert.equal(token.purpose, 'signin')
    assert.equal(token.hash, 'hash')
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 3)
    assert.equal(token.failedAttemptsCount, 0)
    assert.equal(token.maximumFailedAttemptsCount, 5)
    assert.deepEqual(token.metadata, { ip: '127.0.0.1' })
    assert.deepEqual(token.expiresAt, expiresAt)
    assert.isNull(token.lastUsedAt)
    assert.isAtLeast(token.createdAt.getTime(), before)

    const [row] = await rows()
    assert.equal(row.id, token.id)
    assert.equal(row.tokenable_id, 1)
    assert.equal(row.kind, KIND)
    assert.equal(row.name, 'login')
    assert.equal(row.purpose, 'signin')
    assert.equal(row.hash, 'hash')
    assert.equal(row.usage_count, 0)
    assert.equal(row.maximum_usage_count, 3)
    assert.equal(row.failed_attempts_count, 0)
    assert.equal(row.maximum_failed_attempts_count, 5)
    assert.equal(row.metadata, JSON.stringify({ ip: '127.0.0.1' }))
    assert.equal(new Date(row.expires_at).getTime(), expiresAt.getTime())
    assert.isNull(row.last_used_at)
    assert.equal(new Date(row.created_at).getTime(), token.createdAt.getTime())
  })

  test('should persist missing metadata as null', async ({ assert }) => {
    const token = await provider.create(attributes({ metadata: null }))
    const [row] = await rows()

    assert.isNull(token.metadata)
    assert.isNull(row.metadata)
  })

  test('should read the metadata whether the driver returns it as text or parsed')
    .with([
      { stored: '{"ip":"127.0.0.1"}', expected: { ip: '127.0.0.1' } },
      { stored: { ip: '127.0.0.1' }, expected: { ip: '127.0.0.1' } },
      { stored: null, expected: null },
    ])
    .run(({ assert }, { stored, expected }) => {
      const token = new ExposedTokenProvider(db).fromRow(columns({ metadata: stored }))

      assert.deepEqual(token.metadata, expected)
    })

  test('should generate a distinct id for every token', async ({ assert }) => {
    const first = await provider.create(attributes({ hash: 'first' }))
    const second = await provider.create(attributes({ hash: 'second' }))

    assert.notEqual(first.id, second.id)
  })

  test('should find a token by its hash', async ({ assert }) => {
    const token = await provider.create(attributes({ metadata: { ip: '127.0.0.1' } }))
    await provider.create(attributes({ hash: 'other' }))

    const found = await provider.findByHash('hash', { kind: KIND })

    assert.deepEqual(found, token)
  })

  test('should only find a token by its hash for the same kind', async ({ assert }) => {
    await provider.create(attributes({ kind: 'email_verification' }))

    assert.isNull(await provider.findByHash('hash', { kind: KIND }))
    assert.isNull(await provider.findByHash('unknown', { kind: 'email_verification' }))
  })

  test('should find the tokens of a subject, newest first', async ({ assert }) => {
    const older = await provider.create(attributes({ hash: 'older' }))
    const newer = await provider.create(attributes({ hash: 'newer' }))
    await db
      .from(DEFAULT_TOKENS_TABLE_NAME)
      .where({ id: older.id })
      .update({ created_at: new Date(Date.now() - 60_000) })

    const found = await provider.findByTokenableId(1, { kind: KIND, purpose: null })

    assert.deepEqual(
      found.map((t) => t.id),
      [newer.id, older.id]
    )
  })

  test('should filter the tokens of a subject by kind and purpose', async ({ assert }) => {
    const noPurpose = await provider.create(attributes({ hash: 'a' }))
    const signin = await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
    await provider.create(attributes({ hash: 'c', kind: 'email_verification' }))
    await provider.create(attributes({ hash: 'd', tokenableId: 2 }))

    const withoutPurpose = await provider.findByTokenableId(1, { kind: KIND, purpose: null })
    const withPurpose = await provider.findByTokenableId(1, { kind: KIND, purpose: 'signin' })

    assert.deepEqual(
      withoutPurpose.map((t) => t.id),
      [noPurpose.id]
    )
    assert.deepEqual(
      withPurpose.map((t) => t.id),
      [signin.id]
    )
    assert.isEmpty(await provider.findByTokenableId(3, { kind: KIND, purpose: null }))
  })

  test('should mark a token as used', async ({ assert }) => {
    const token = await provider.create(attributes({ maximumUsageCount: 2 }))
    const before = Date.now()

    const used = await provider.markAsUsed(token)

    assert.instanceOf(used, SentinelToken)
    assert.equal(used!.id, token.id)
    assert.equal(used!.usageCount, 1)
    assert.isAtLeast(used!.lastUsedAt!.getTime(), before)

    const [row] = await rows()
    assert.equal(row.usage_count, 1)
    assert.equal(new Date(row.last_used_at!).getTime(), used!.lastUsedAt!.getTime())
  })

  test('should refuse to mark a token as used beyond its maximum usage count', async ({
    assert,
  }) => {
    const token = await provider.create(attributes({ maximumUsageCount: 1 }))

    assert.isNotNull(await provider.markAsUsed(token))
    assert.isNull(await provider.markAsUsed(token))

    const [row] = await rows()
    assert.equal(row.usage_count, 1)
  })

  test('should record a failed attempt', async ({ assert }) => {
    const token = await provider.create(attributes({ maximumFailedAttemptsCount: 2 }))

    const updated = await provider.recordFailedAttempt(token)

    assert.instanceOf(updated, SentinelToken)
    assert.equal(updated!.id, token.id)
    assert.equal(updated!.failedAttemptsCount, 1)
    assert.equal(updated!.usageCount, 0)

    const [row] = await rows()
    assert.equal(row.failed_attempts_count, 1)
    assert.equal(row.usage_count, 0)
  })

  test('should refuse to record a failed attempt beyond the maximum failed attempts count', async ({
    assert,
  }) => {
    const token = await provider.create(attributes({ maximumFailedAttemptsCount: 1 }))

    assert.isNotNull(await provider.recordFailedAttempt(token))
    assert.isNull(await provider.recordFailedAttempt(token))

    const [row] = await rows()
    assert.equal(row.failed_attempts_count, 1)
  })

  test('should record failed attempts without limit when the token has no maximum', async ({
    assert,
  }) => {
    const token = await provider.create(attributes({ maximumFailedAttemptsCount: null }))

    for (let attempt = 0; attempt < 3; attempt++) {
      assert.isNotNull(await provider.recordFailedAttempt(token))
    }

    const [row] = await rows()
    assert.equal(row.failed_attempts_count, 3)
  })

  test('should invalidate a token', async ({ assert }) => {
    const token = await provider.create(attributes({ hash: 'a' }))
    const other = await provider.create(attributes({ hash: 'b' }))

    await provider.invalidate(token)

    assert.deepEqual(
      (await rows()).map((row) => row.id),
      [other.id]
    )
  })

  test('should invalidate the tokens of a subject', async ({ assert }) => {
    await provider.create(attributes({ hash: 'a' }))
    await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
    const otherKind = await provider.create(attributes({ hash: 'c', kind: 'email_verification' }))
    const otherSubject = await provider.create(attributes({ hash: 'd', tokenableId: 2 }))

    await provider.invalidateByTokenableId(1, { kind: KIND })

    assert.deepEqual(
      (await rows()).map((row) => row.id),
      [otherKind.id, otherSubject.id]
    )
  })

  test('should invalidate the tokens of a subject with the given purpose', async ({ assert }) => {
    const noPurpose = await provider.create(attributes({ hash: 'a' }))
    await provider.create(attributes({ hash: 'b', purpose: 'signin' }))
    const signup = await provider.create(attributes({ hash: 'c', purpose: 'signup' }))

    await provider.invalidateByTokenableId(1, { kind: KIND, purpose: 'signin' })
    assert.deepEqual(
      (await rows()).map((row) => row.id),
      [noPurpose.id, signup.id]
    )

    await provider.invalidateByTokenableId(1, { kind: KIND, purpose: null })
    assert.deepEqual(
      (await rows()).map((row) => row.id),
      [signup.id]
    )
  })

  test('should use the given table', async ({ assert }) => {
    const custom = new LucidTokenProvider(db, { table: CUSTOM_TABLE })

    const token = await custom.create(attributes())

    assert.isEmpty(await rows())
    assert.deepEqual(
      (await rows(CUSTOM_TABLE)).map((row) => row.id),
      [token.id]
    )
    assert.deepEqual(await custom.findByHash('hash', { kind: KIND }), token)
  })

  test('should use the given connection', async ({ assert }) => {
    const secondary = new LucidTokenProvider(db, { connection: 'secondary' })

    const token = await secondary.create(attributes())

    assert.isEmpty(await rows())
    assert.deepEqual(
      (await rows(DEFAULT_TOKENS_TABLE_NAME, 'secondary')).map((row) => row.id),
      [token.id]
    )
  })

  test('should be created by the "tokens.lucid" config helper', async ({ assert }) => {
    const resolved = await configProvider.resolve<TokenProviderContract>(
      app,
      tokens.lucid({ table: CUSTOM_TABLE })
    )

    assert.instanceOf(resolved, LucidTokenProvider)

    const token = await resolved!.create(attributes())
    assert.deepEqual(
      (await rows(CUSTOM_TABLE)).map((row) => row.id),
      [token.id]
    )
  })
})
