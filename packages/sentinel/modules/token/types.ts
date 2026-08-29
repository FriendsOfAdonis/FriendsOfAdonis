import type { RecordId } from '../../src/types.ts'
import type { SentinelToken } from './token.ts'

/**
 * Hashers available to hash the tokens.
 *
 * - "sha256" is fast and deterministic, so a token can be found by
 *   its value. Use it for the high-entropy secrets the package
 *   generates, like magic links.
 * - "scrypt" is slow and salted, so a token can only be found through
 *   its subject. Use it for the low-entropy codes a human types, like
 *   one-time passwords.
 */
export type TokenHasher = 'sha256' | 'scrypt'

/**
 * A set of properties a token hasher must implement
 */
export interface TokenHasherContract {
  /**
   * Whether the same value always produces the same hash. Only a
   * deterministic hasher allows finding a token by its hash.
   */
  readonly deterministic: boolean

  /**
   * Hashes the value
   */
  make(value: string): Promise<string>

  /**
   * Verifies the value against the hash
   */
  verify(hash: string, value: string): Promise<boolean>
}

/**
 * Options accepted when creating a token
 */
export interface CreateTokenOptions {
  /**
   * A unique kind to identify a bucket of tokens within the storage
   * layer, for example "otp" or "magic_link"
   */
  kind: string

  /**
   * The hasher used to hash the value.
   *
   * Defaults to "sha256"
   */
  hasher?: TokenHasher

  /**
   * Number of times the token can be verified before it is exhausted.
   *
   * Defaults to 1
   */
  maximumUsage?: number

  /**
   * Number of failed verifications after which the token is locked.
   * Failed attempts are only counted when verifying by subject using
   * the "tokenableId" option, since a wrong value cannot be matched
   * to a token otherwise.
   *
   * By default tokens never lock
   */
  maximumFailedAttempts?: number

  /**
   * Recognizable name for the token
   */
  name?: string

  /**
   * The lifetime of the token, in seconds or as a duration string
   * like "20m".
   *
   * Defaults to "20m"
   */
  expiresIn?: string | number

  /**
   * The purpose the token is created for. It must be given again to
   * verify the token.
   */
  purpose?: string

  /**
   * Arbitrary data attached to the token and handed back by the
   * verification
   */
  metadata?: Record<string, unknown>
}

/**
 * Options accepted when verifying a token
 */
export interface VerifyTokenOptions {
  /**
   * The kind of the token to verify
   */
  kind: string

  /**
   * The hasher the token was created with.
   *
   * Defaults to "sha256"
   */
  hasher?: TokenHasher

  /**
   * The purpose the token was created with, if any
   */
  purpose?: string

  /**
   * The primary key of the subject to narrow the lookup to. Required
   * with the "scrypt" hasher, whose hashes cannot be searched.
   */
  tokenableId?: RecordId
}

/**
 * Options accepted when invalidating the tokens of a subject
 */
export interface InvalidateTokensOptions {
  /**
   * The kind of the tokens to invalidate
   */
  kind: string

  /**
   * The purpose of the tokens to invalidate. Leaving the option out
   * targets the tokens without a purpose.
   */
  purpose?: string
}

/**
 * Options accepted when invalidating every token of a subject,
 * whatever their purpose
 */
export interface InvalidateAllTokensOptions {
  /**
   * The kind of the tokens to invalidate
   */
  kind: string
}

/**
 * Attributes handed to the token provider to persist a new token
 */
export interface TokenAttributes {
  /**
   * Reference to the primary key of the subject the token is
   * created for
   */
  tokenableId: RecordId

  /**
   * A unique kind to identify a bucket of tokens within the storage
   * layer
   */
  kind: string

  /**
   * Hash computed from the value to later verify it
   */
  hash: string

  /**
   * Recognizable name for the token
   */
  name: string | null

  /**
   * The purpose the token is created for, if any
   */
  purpose: string | null

  /**
   * Number of verifications after which the token is exhausted
   */
  maximumUsageCount: number

  /**
   * Number of failed verifications after which the token is locked.
   * A null value means the token never locks
   */
  maximumFailedAttemptsCount: number | null

  /**
   * Arbitrary data attached to the token
   */
  metadata: Record<string, unknown> | null

  /**
   * Timestamp at which the token will expire
   */
  expiresAt: Date
}

/**
 * Options accepted when finding a token by its hash
 */
export interface FindTokenOptions {
  /**
   * The kind of the token to find
   */
  kind: string
}

/**
 * Options accepted when finding the tokens of a subject
 */
export interface FindTokenableTokensOptions {
  /**
   * The kind of the tokens to find
   */
  kind: string

  /**
   * The purpose of the tokens to find. A null value targets the
   * tokens without a purpose.
   */
  purpose: string | null
}

/**
 * Options handed to the token provider to invalidate the tokens of a
 * subject
 */
export interface InvalidateTokenableTokensOptions {
  /**
   * The kind of the tokens to invalidate
   */
  kind: string

  /**
   * The purpose of the tokens to invalidate. A null value targets
   * the tokens without a purpose.
   */
  purpose: string | null
}

/**
 * A set of properties a token provider must implement to persist
 * tokens. The lucid provider stores them in the database.
 */
export interface TokenProviderContract {
  /**
   * Persists a new token
   */
  create(attributes: TokenAttributes): Promise<SentinelToken>

  /**
   * Finds a token by its hash. Returns null when no token matches.
   */
  findByHash(hash: string, options: FindTokenOptions): Promise<SentinelToken | null>

  /**
   * Finds the tokens of a subject matching the kind and purpose
   */
  findByTokenableId(
    tokenableId: RecordId,
    options: FindTokenableTokensOptions
  ): Promise<SentinelToken[]>

  /**
   * Increments the usage count of the token. The update must be
   * atomic: two concurrent calls on a token with one usage left
   * cannot both succeed.
   *
   * Returns null when the maximum usage count was already reached.
   */
  markAsUsed(token: SentinelToken): Promise<SentinelToken | null>

  /**
   * Increments the failed attempts count of the token, with the same
   * atomicity as "markAsUsed".
   *
   * Returns null when the token was already locked.
   */
  recordFailedAttempt(token: SentinelToken): Promise<SentinelToken | null>

  /**
   * Removes the token
   */
  invalidate(token: SentinelToken): Promise<void>

  /**
   * Removes the tokens of a subject matching the kind and purpose
   */
  invalidateByTokenableId(
    tokenableId: RecordId,
    options: InvalidateTokenableTokensOptions
  ): Promise<void>

  /**
   * Removes the tokens of a subject matching the kind, whatever
   * their purpose
   */
  invalidateAllByTokenableId(
    tokenableId: RecordId,
    options: InvalidateAllTokensOptions
  ): Promise<void>
}
