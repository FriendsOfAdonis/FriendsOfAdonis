import type { RecordId } from '../../src/types.ts'

export interface SentinelTokenAttributes {
  id: RecordId
  tokenableId: RecordId
  kind: string
  name: string | null
  purpose: string | null
  hash: string
  usageCount: number
  maximumUsageCount: number
  failedAttemptsCount: number
  maximumFailedAttemptsCount: number | null
  metadata: Record<string, unknown> | null
  expiresAt: Date
  lastUsedAt: Date | null
  createdAt: Date
}

/**
 * A persisted token. Only the hash of the token value is kept,
 * the value itself is handed once to the user when created.
 */
export class SentinelToken implements SentinelTokenAttributes {
  declare id: RecordId
  declare tokenableId: RecordId
  declare kind: string
  declare name: string | null
  declare purpose: string | null
  declare hash: string
  declare usageCount: number
  declare maximumUsageCount: number
  declare failedAttemptsCount: number
  declare maximumFailedAttemptsCount: number | null
  declare metadata: Record<string, unknown> | null
  declare expiresAt: Date
  declare lastUsedAt: Date | null
  declare createdAt: Date

  constructor(attributes: SentinelTokenAttributes) {
    Object.assign(this, attributes)
  }

  isExpired() {
    return this.expiresAt < new Date()
  }

  isExhausted() {
    return this.usageCount >= this.maximumUsageCount
  }

  /**
   * Whether the token has been the target of too many failed verification
   * attempts. Tokens without a maximum failed attempts count never lock.
   */
  isLocked() {
    return (
      this.maximumFailedAttemptsCount !== null &&
      this.failedAttemptsCount >= this.maximumFailedAttemptsCount
    )
  }
}
