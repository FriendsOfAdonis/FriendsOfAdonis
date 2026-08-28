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

export interface LucidTokenProviderOptions {
  /**
   * Database connection name configured in `config/database.ts`.
   *
   * @default to primary connection
   */
  connection?: string

  /**
   * Table name used for storing tokens.
   *
   * @default "sentinel_tokens"
   */
  table?: string
}

export interface LucidTokenColumns {
  id: RecordId
  tokenable_id: RecordId
  kind: string
  name: string | null
  purpose: string | null
  hash: string
  usage_count: number
  maximum_usage_count: number
  failed_attempts_count: number
  maximum_failed_attempts_count: number | null
  /**
   * Text columns hand the JSON back as a string, json/jsonb columns
   * (Postgres) hand it back already parsed by the driver.
   */
  metadata: string | Record<string, unknown> | null
  expires_at: Date | number
  last_used_at: Date | number | null
  created_at: Date | number
}

export class LucidTokenProvider implements TokenProviderContract {
  protected table: string
  protected connection: QueryClientContract

  constructor(db: Database, options: LucidTokenProviderOptions = {}) {
    this.table = options.table ?? DEFAULT_TOKENS_TABLE_NAME
    this.connection = db.connection(options.connection)
  }

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

    const result = await this.connection.table(this.table).insert(row).returning('id')
    const id = typeof result[0] === 'object' ? result[0].id : result[0]

    if (!id) {
      throw new RuntimeException(
        `Cannot save sentinel token. The result "${inspect(result)}" of insert query is unexpected`
      )
    }

    return this.tokenFromRow({ id, ...row })
  }

  async findByHash(hash: string, options: FindTokenOptions) {
    const row = await this.query().where({ kind: options.kind, hash }).first()
    return row ? this.tokenFromRow(row) : null
  }

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

  async invalidate(token: SentinelToken) {
    await this.query().where({ id: token.id }).del()
  }

  async invalidateByTokenableId(tokenableId: RecordId, options: InvalidateTokensOptions) {
    const query = this.query().where({ tokenable_id: tokenableId, kind: options.kind })

    if (options.purpose === null) {
      query.whereNull('purpose')
    } else if (options.purpose !== undefined) {
      query.where('purpose', options.purpose)
    }

    await query.del()
  }

  protected query() {
    return this.connection.query<LucidTokenColumns>().from(this.table)
  }

  protected async find(id: RecordId) {
    const row = await this.query().where({ id }).first()
    return row ? this.tokenFromRow(row) : null
  }

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

  protected metadataFromRow(metadata: LucidTokenColumns['metadata']) {
    if (!metadata) return null
    return typeof metadata === 'string'
      ? (JSON.parse(metadata) as Record<string, unknown>)
      : metadata
  }
}
