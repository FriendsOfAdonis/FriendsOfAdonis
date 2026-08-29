import { RecordId } from '../../../src/types.ts'
import { SentinelToken } from '../token.ts'
import {
  FindTokenableTokensOptions,
  FindTokenOptions,
  InvalidateAllTokensOptions,
  InvalidateTokenableTokensOptions,
  TokenAttributes,
  TokenProviderContract,
} from '../types.ts'

/**
 * Token provider keeping the tokens in memory. Meant for testing,
 * the tokens are lost when the process exits.
 */
export class FakeMemoryTokenProvider implements TokenProviderContract {
  /**
   * Tokens persisted so far, exposed to write assertions
   */
  tokens: SentinelToken[] = []

  /**
   * Counter used to assign the primary keys
   */
  #sequence = 0

  /**
   * Persists a new token
   */
  async create(attributes: TokenAttributes) {
    const token = new SentinelToken({
      ...attributes,
      id: ++this.#sequence,
      usageCount: 0,
      failedAttemptsCount: 0,
      lastUsedAt: null,
      createdAt: new Date(),
    })
    this.tokens.push(token)
    return token
  }

  /**
   * Finds a token by its hash
   */
  async findByHash(hash: string, options: FindTokenOptions) {
    return this.tokens.find((t) => t.kind === options.kind && t.hash === hash) ?? null
  }

  /**
   * Finds the tokens of a subject matching the kind and purpose
   */
  async findByTokenableId(tokenableId: RecordId, options: FindTokenableTokensOptions) {
    return this.tokens.filter(
      (t) =>
        t.tokenableId === tokenableId && t.kind === options.kind && t.purpose === options.purpose
    )
  }

  /**
   * Increments the usage count of the token, unless it is exhausted
   */
  async markAsUsed(token: SentinelToken) {
    if (token.isExhausted()) return null
    token.usageCount += 1
    token.lastUsedAt = new Date()
    return token
  }

  /**
   * Increments the failed attempts count of the token, unless it is
   * locked
   */
  async recordFailedAttempt(token: SentinelToken) {
    if (token.isLocked()) return null
    token.failedAttemptsCount += 1
    return token
  }

  /**
   * Removes the token
   */
  async invalidate(token: SentinelToken) {
    this.tokens = this.tokens.filter((t) => t.id !== token.id)
  }

  /**
   * Removes the tokens of a subject matching the kind and purpose
   */
  async invalidateByTokenableId(tokenableId: RecordId, options: InvalidateTokenableTokensOptions) {
    this.tokens = this.tokens.filter(
      (t) =>
        !(t.tokenableId === tokenableId && t.kind === options.kind && t.purpose === options.purpose)
    )
  }

  /**
   * Removes the tokens of a subject matching the kind, whatever
   * their purpose
   */
  async invalidateAllByTokenableId(tokenableId: RecordId, options: InvalidateAllTokensOptions) {
    this.tokens = this.tokens.filter(
      (t) => !(t.tokenableId === tokenableId && t.kind === options.kind)
    )
  }
}
