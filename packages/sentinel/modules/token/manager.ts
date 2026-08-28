import { RuntimeException } from '@adonisjs/core/exceptions'
import type { HashManager } from '@adonisjs/core/hash'
import type { Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import { DEFAULT_TOKEN_EXPIRES_IN, DEFAULT_TOKEN_HASHER } from './constants.ts'
import type { RecordId } from '../../src/types.ts'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from './errors.ts'
import { ScryptTokenHasher, Sha256TokenHasher } from './hashers.ts'
import type { SentinelToken } from './token.ts'
import type {
  CreateTokenOptions,
  InvalidateTokensOptions,
  TokenHasher,
  TokenHasherContract,
  TokenProviderContract,
  VerifyTokenOptions,
} from './types.ts'

export class TokenManager {
  #hashers = new Map<TokenHasher, TokenHasherContract>()

  constructor(
    protected provider: TokenProviderContract,
    protected hash: HashManager<never>
  ) {}

  /**
   * Returns the hasher registered under the given name.
   */
  hasher(name: TokenHasher = DEFAULT_TOKEN_HASHER): TokenHasherContract {
    const cached = this.#hashers.get(name)
    if (cached) return cached

    const hasher = this.createHasher(name)
    this.#hashers.set(name, hasher)
    return hasher
  }

  /**
   * Persists a token. Only the hash of the value is stored, the value
   * must be handed to the user by the caller.
   */
  async create(
    tokenableId: RecordId,
    value: Secret<string>,
    options: CreateTokenOptions
  ): Promise<SentinelToken> {
    const hasher = this.hasher(options.hasher)

    const expiresAt = new Date()
    expiresAt.setSeconds(
      expiresAt.getSeconds() + string.seconds.parse(options.expiresIn ?? DEFAULT_TOKEN_EXPIRES_IN)
    )

    return this.provider.create({
      tokenableId,
      kind: options.kind,
      hash: await hasher.make(value.release()),
      name: options.name ?? null,
      purpose: options.purpose ?? null,
      maximumUsageCount: options.maximumUsage ?? 1,
      maximumFailedAttemptsCount: options.maximumFailedAttempts ?? null,
      metadata: options.metadata ?? null,
      expiresAt,
    })
  }

  /**
   * Verifies a token value and returns the matching {@link SentinelToken}.
   *
   * Checks the purpose, the expiration and the usage count, then records
   * the usage. Tokens that can no longer be used are invalidated.
   *
   * When the lookup is narrowed to a subject, a value matching none of
   * its tokens counts as a failed attempt against each of them. Tokens
   * reaching their maximum failed attempts count are invalidated.
   *
   * @throws {E_TOO_MANY_ATTEMPTS} When no token matches the value and a
   * token of the subject is locked, either before or by this attempt.
   * @throws {E_INVALID_TOKEN} When no usable token matches the value.
   */
  async verify(value: Secret<string>, options: VerifyTokenOptions): Promise<SentinelToken> {
    const hasher = this.hasher(options.hasher)
    const invalid = () => new E_INVALID_TOKEN(options.kind, options.purpose)

    const token = await this.match(value, hasher, options)
    if (!token) throw invalid()
    if (token.purpose !== (options.purpose ?? null)) throw invalid()

    if (token.isExpired()) {
      await this.provider.invalidate(token)
      throw invalid()
    }

    const used = await this.provider.markAsUsed(token)
    if (!used) {
      await this.provider.invalidate(token)
      throw invalid()
    }

    if (used.isExhausted()) {
      await this.provider.invalidate(used)
    }

    return used
  }

  /**
   * Invalidates the tokens of a given subject.
   */
  invalidate(tokenableId: RecordId, options: InvalidateTokensOptions): Promise<void> {
    return this.provider.invalidateByTokenableId(tokenableId, options)
  }

  /**
   * Finds the persisted token matching the given value, if any. When no
   * candidate matches, a failed attempt is recorded against each of them.
   *
   * @throws {E_TOO_MANY_ATTEMPTS} When no candidate matches and one of
   * them is locked, either before or by this attempt.
   */
  protected async match(
    value: Secret<string>,
    hasher: TokenHasherContract,
    options: VerifyTokenOptions
  ): Promise<SentinelToken | null> {
    const plain = value.release()
    const mismatched: SentinelToken[] = []
    let locked = false

    for (const candidate of await this.candidates(plain, hasher, options)) {
      if (candidate.isLocked()) {
        await this.provider.invalidate(candidate)
        locked = true
        continue
      }

      if (await hasher.verify(candidate.hash, plain)) return candidate
      mismatched.push(candidate)
    }

    const outcomes = await Promise.all(
      mismatched.map((candidate) => this.recordFailedAttempt(candidate))
    )

    if (locked || outcomes.includes(true)) {
      throw new E_TOO_MANY_ATTEMPTS(options.kind, options.purpose)
    }

    return null
  }

  /**
   * Records a failed attempt against a token and invalidates it once
   * its maximum failed attempts count is reached.
   *
   * @returns Whether the token is now locked.
   */
  protected async recordFailedAttempt(token: SentinelToken): Promise<boolean> {
    const updated = await this.provider.recordFailedAttempt(token)
    const isLocked = !updated || updated.isLocked()

    if (isLocked) {
      await this.provider.invalidate(updated ?? token)
    }

    return isLocked
  }

  /**
   * Looks the persisted tokens that may match the given value up. Tokens
   * hashed with a non deterministic hasher can only be found through
   * their subject.
   */
  protected async candidates(
    plain: string,
    hasher: TokenHasherContract,
    options: VerifyTokenOptions
  ): Promise<SentinelToken[]> {
    if (options.tokenableId !== undefined) {
      return this.provider.findByTokenableId(options.tokenableId, {
        kind: options.kind,
        purpose: options.purpose ?? null,
      })
    }

    if (!hasher.deterministic) {
      throw new RuntimeException(
        `Cannot verify "${options.kind}" tokens by value. The "${options.hasher}" hasher is not deterministic, provide the "tokenableId" option to look the token up by its subject`
      )
    }

    const token = await this.provider.findByHash(await hasher.make(plain), { kind: options.kind })
    return token ? [token] : []
  }

  protected createHasher(name: TokenHasher): TokenHasherContract {
    switch (name) {
      case 'sha256':
        return new Sha256TokenHasher()
      case 'scrypt':
        if (!('scrypt' in this.hash.config.list)) {
          throw new RuntimeException(
            'Cannot hash tokens with "scrypt". Make sure a "scrypt" hasher is defined inside the "config/hash.ts" file'
          )
        }
        return new ScryptTokenHasher(this.hash.use('scrypt'))
      default:
        throw new RuntimeException(`Unknown token hasher "${name}"`)
    }
  }
}
