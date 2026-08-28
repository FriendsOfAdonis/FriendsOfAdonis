import { RecordId } from '../../../src/types.ts'
import { SentinelToken } from '../token.ts'
import {
  FindTokenableTokensOptions,
  FindTokenOptions,
  InvalidateTokensOptions,
  TokenAttributes,
  TokenProviderContract,
} from '../types.ts'

export class FakeMemoryTokenProvider implements TokenProviderContract {
  tokens: SentinelToken[] = []
  #sequence = 0

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

  async findByHash(hash: string, options: FindTokenOptions) {
    return this.tokens.find((t) => t.kind === options.kind && t.hash === hash) ?? null
  }

  async findByTokenableId(tokenableId: RecordId, options: FindTokenableTokensOptions) {
    return this.tokens.filter(
      (t) =>
        t.tokenableId === tokenableId && t.kind === options.kind && t.purpose === options.purpose
    )
  }

  async markAsUsed(token: SentinelToken) {
    if (token.isExhausted()) return null
    token.usageCount += 1
    token.lastUsedAt = new Date()
    return token
  }

  async recordFailedAttempt(token: SentinelToken) {
    if (token.isLocked()) return null
    token.failedAttemptsCount += 1
    return token
  }

  async invalidate(token: SentinelToken) {
    this.tokens = this.tokens.filter((t) => t.id !== token.id)
  }

  async invalidateByTokenableId(tokenableId: RecordId, options: InvalidateTokensOptions) {
    this.tokens = this.tokens.filter(
      (t) =>
        !(
          t.tokenableId === tokenableId &&
          t.kind === options.kind &&
          (options.purpose === undefined || t.purpose === options.purpose)
        )
    )
  }
}
