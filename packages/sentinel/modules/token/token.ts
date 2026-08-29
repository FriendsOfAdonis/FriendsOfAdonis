import type { RecordId } from '../../src/types.ts'

/**
 * Attributes of a persisted token
 */
export interface SentinelTokenAttributes {
  /**
   * Token primary key within the storage layer
   */
  id: RecordId

  /**
   * Reference to the primary key of the subject the token was
   * created for
   */
  tokenableId: RecordId

  /**
   * A unique kind to identify a bucket of tokens within the storage
   * layer, for example "otp" or "magic_link"
   */
  kind: string

  /**
   * Recognizable name for the token
   */
  name: string | null

  /**
   * The purpose the token was created for, if any
   */
  purpose: string | null

  /**
   * Hash computed from the value to later verify it
   */
  hash: string

  /**
   * Number of times the token has been verified
   */
  usageCount: number

  /**
   * Number of verifications after which the token is exhausted
   */
  maximumUsageCount: number

  /**
   * Number of failed verifications recorded against the token
   */
  failedAttemptsCount: number

  /**
   * Number of failed verifications after which the token is locked.
   * A null value means the token never locks
   */
  maximumFailedAttemptsCount: number | null

  /**
   * Arbitrary data attached to the token at creation
   */
  metadata: Record<string, unknown> | null

  /**
   * Timestamp at which the token will expire
   */
  expiresAt: Date

  /**
   * Last time the token was verified
   */
  lastUsedAt: Date | null

  /**
   * Timestamp at which the token was created
   */
  createdAt: Date
}

/**
 * Token represents a secret created for a subject, for example an
 * OTP or a password reset token. It carries the hash of the value
 * only, the value itself is never persisted.
 *
 * @example
 * const token = await tokens.verify(value, { kind: 'otp', tokenableId: user.id })
 * console.log(token.metadata)
 */
export class SentinelToken implements SentinelTokenAttributes {
  /**
   * Token primary key within the storage layer
   */
  declare id: RecordId

  /**
   * Reference to the primary key of the subject the token was
   * created for
   */
  declare tokenableId: RecordId

  /**
   * A unique kind to identify a bucket of tokens within the storage
   * layer, for example "otp" or "magic_link"
   */
  declare kind: string

  /**
   * Recognizable name for the token
   */
  declare name: string | null

  /**
   * The purpose the token was created for. It must be given again
   * to verify the token
   */
  declare purpose: string | null

  /**
   * Hash computed from the value to later verify it
   */
  declare hash: string

  /**
   * Number of times the token has been verified
   */
  declare usageCount: number

  /**
   * Number of verifications after which the token is exhausted
   */
  declare maximumUsageCount: number

  /**
   * Number of failed verifications recorded against the token
   */
  declare failedAttemptsCount: number

  /**
   * Number of failed verifications after which the token is locked.
   * A null value means the token never locks
   */
  declare maximumFailedAttemptsCount: number | null

  /**
   * Arbitrary data attached to the token at creation and handed
   * back by the verification
   */
  declare metadata: Record<string, unknown> | null

  /**
   * Timestamp at which the token will expire
   */
  declare expiresAt: Date

  /**
   * Last time the token was verified
   */
  declare lastUsedAt: Date | null

  /**
   * Timestamp at which the token was created
   */
  declare createdAt: Date

  constructor(attributes: SentinelTokenAttributes) {
    Object.assign(this, attributes)
  }

  /**
   * Check if the token has expired. Verifies the "expiresAt"
   * timestamp against the current date.
   */
  isExpired() {
    return this.expiresAt < new Date()
  }

  /**
   * Check if the token has been verified as many times as allowed
   */
  isExhausted() {
    return this.usageCount >= this.maximumUsageCount
  }

  /**
   * Check if the token has reached its maximum number of failed
   * attempts
   */
  isLocked() {
    return (
      this.maximumFailedAttemptsCount !== null &&
      this.failedAttemptsCount >= this.maximumFailedAttemptsCount
    )
  }
}
