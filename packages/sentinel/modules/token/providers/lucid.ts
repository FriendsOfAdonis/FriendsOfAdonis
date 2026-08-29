import { inspect } from 'node:util'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { Database } from '@adonisjs/lucid/database'
import type { QueryClientContract } from '@adonisjs/lucid/types/database'
import { DEFAULT_TOKENS_TABLE_NAME } from '../constants.ts'
import type { RecordId } from '../../../src/types.ts'
import { SentinelToken } from '../token.ts'
import type {
  FindTokenableTokensOptions,
  FindTokenOptions,
  InvalidateTokensOptions,
  TokenAttributes,
  TokenProviderContract,
} from '../types.ts'

/**
 * Options accepted by the token provider that uses the lucid database
 * service to persist tokens
 */
export interface LucidTokenProviderOptions {
  /**
   * The database connection to use.
   *
   * Defaults to the primary connection
   */
  connection?: string

  /**
   * Database table to use for querying tokens.
   *
   * Defaults to "sentinel_tokens"
   */
  table?: string
}

/**
 * The database columns expected at the database level
 */
export interface LucidTokenColumns {
  /**
   * Token primary key. It can be an integer, bigInteger or a UUID or
   * any other string based value
   */
  id: RecordId

  /**
   * The subject for whom the token is created
   */
  tokenable_id: RecordId

  /**
   * A unique kind to identify a bucket of tokens within the storage
   * layer
   */
  kind: string

  /**
   * Optional name for the token
   */
  name: string | null

  /**
   * The purpose the token is created for, if any
   */
  purpose: string | null

  /**
   * Token hash is used to verify the value shared with the user
   */
  hash: string

  /**
   * Usage counters
   */
  usage_count: number
  maximum_usage_count: number

  /**
   * Failed attempts counters. A null maximum means the token never
   * locks
   */
  failed_attempts_count: number
  maximum_failed_attempts_count: number | null

  /**
   * Arbitrary data stored as JSON. Text columns hand it back as a
   * string, json and jsonb columns as an object already parsed by
   * the driver
   */
  metadata: string | Record<string, unknown> | null

  /**
   * Timestamps. Some drivers, like SQLite, hand them back as numbers
   */
  expires_at: Date | number
  last_used_at: Date | number | null
  created_at: Date | number
}

/**
 * Token provider using the lucid database service to persist tokens
 *
 * @example
 * const provider = new LucidTokenProvider(db, { table: 'sentinel_tokens' })
 */
export class LucidTokenProvider implements TokenProviderContract {
  /**
   * Database table to use for querying tokens
   */
  protected table: string

  /**
   * Query client of the configured connection
   */
  protected connection: QueryClientContract

  constructor(db: Database, options: LucidTokenProviderOptions = {}) {
    this.table = options.table ?? DEFAULT_TOKENS_TABLE_NAME
    this.connection = db.connection(options.connection)
  }

  /**
   * Persists a new token and returns it with its primary key
   */
  async create(attributes: TokenAttributes) {
    const row: Omit<LucidTokenColumns, 'id'> = {
      tokenable_id: attributes.tokenableId,
      kind: attributes.kind,
      name: attributes.name,
      purpose: attributes.purpose,
      hash: attributes.hash,
      usage_count: 0,
      maximum_usage_count: attributes.maximumUsageCount,
      failed_attempts_count: 0,
      maximum_failed_attempts_count: attributes.maximumFailedAttemptsCount,
      metadata: attributes.metadata ? JSON.stringify(attributes.metadata) : null,
      expires_at: attributes.expiresAt,
      last_used_at: null,
      created_at: new Date(),
    }

    /**
     * The "returning" clause hands back an object on some dialects
     * and a bare id on the others
     */
    const result = await this.connection.table(this.table).insert(row).returning('id')
    const id = typeof result[0] === 'object' ? result[0].id : result[0]

    if (!id) {
      throw new RuntimeException(
        `Cannot save sentinel token. The result "${inspect(result)}" of insert query is unexpected`
      )
    }

    return this.tokenFromRow({ id, ...row })
  }

  /**
   * Finds a token by its hash
   */
  async findByHash(hash: string, options: FindTokenOptions) {
    const row = await this.query().where({ kind: options.kind, hash }).first()
    return row ? this.tokenFromRow(row) : null
  }

  /**
   * Finds the tokens of a subject matching the kind and purpose,
   * newest first
   */
  async findByTokenableId(tokenableId: RecordId, options: FindTokenableTokensOptions) {
    const query = this.query().where({ tokenable_id: tokenableId, kind: options.kind })

    if (options.purpose === null) {
      query.whereNull('purpose')
    } else {
      query.where('purpose', options.purpose)
    }

    const rows = await query.orderBy('created_at', 'desc')
    return rows.map((row) => this.tokenFromRow(row))
  }

  /**
   * Increments the usage count of the token, unless it is exhausted.
   * The condition is part of the query, so that two concurrent calls
   * cannot both succeed.
   */
  async markAsUsed(token: SentinelToken) {
    const affected = await this.query()
      .where({ id: token.id })
      .whereRaw('usage_count < maximum_usage_count')
      .update({
        usage_count: this.connection.raw('usage_count + 1'),
        last_used_at: new Date(),
      })

    return affected ? this.find(token.id) : null
  }

  /**
   * Increments the failed attempts count of the token, unless it is
   * locked. The condition is part of the query, so that two
   * concurrent calls cannot both succeed.
   */
  async recordFailedAttempt(token: SentinelToken) {
    const affected = await this.query()
      .where({ id: token.id })
      .where((query) => {
        query
          .whereNull('maximum_failed_attempts_count')
          .orWhereRaw('failed_attempts_count < maximum_failed_attempts_count')
      })
      .update({ failed_attempts_count: this.connection.raw('failed_attempts_count + 1') })

    return affected ? this.find(token.id) : null
  }

  /**
   * Deletes the token
   */
  async invalidate(token: SentinelToken) {
    await this.query().where({ id: token.id }).del()
  }

  /**
   * Deletes the tokens of a subject. A null purpose targets the
   * tokens without a purpose, an undefined one every purpose.
   */
  async invalidateByTokenableId(tokenableId: RecordId, options: InvalidateTokensOptions) {
    const query = this.query().where({ tokenable_id: tokenableId, kind: options.kind })

    if (options.purpose === null) {
      query.whereNull('purpose')
    } else if (options.purpose !== undefined) {
      query.where('purpose', options.purpose)
    }

    await query.del()
  }

  /**
   * Returns a query builder for the tokens table
   */
  protected query() {
    return this.connection.query<LucidTokenColumns>().from(this.table)
  }

  /**
   * Finds a token by its primary key
   */
  protected async find(id: RecordId) {
    const row = await this.query().where({ id }).first()
    return row ? this.tokenFromRow(row) : null
  }

  /**
   * Maps a database row to a token instance
   */
  protected tokenFromRow(row: LucidTokenColumns) {
    return new SentinelToken({
      id: row.id,
      tokenableId: row.tokenable_id,
      kind: row.kind,
      name: row.name,
      purpose: row.purpose,
      hash: row.hash,
      usageCount: row.usage_count,
      maximumUsageCount: row.maximum_usage_count,
      failedAttemptsCount: row.failed_attempts_count,
      maximumFailedAttemptsCount: row.maximum_failed_attempts_count,
      metadata: this.metadataFromRow(row.metadata),
      expiresAt: new Date(row.expires_at),
      lastUsedAt: row.last_used_at === null ? null : new Date(row.last_used_at),
      createdAt: new Date(row.created_at),
    })
  }

  /**
   * Parses the metadata column, unless the driver already did
   */
  protected metadataFromRow(metadata: LucidTokenColumns['metadata']) {
    if (!metadata) return null
    return typeof metadata === 'string'
      ? (JSON.parse(metadata) as Record<string, unknown>)
      : metadata
  }
}
