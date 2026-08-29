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

/**
 * Token manager creates, verifies and invalidates the tokens used by
 * the OTP, magic link and password modules. It hashes the token values
 * and delegates their persistence to the token provider.
 *
 * @example
 * const value = new Secret(string.random(40))
 * await tokens.create(user.id, value, { kind: 'magic_link' })
 *
 * const token = await tokens.verify(value, { kind: 'magic_link' })
 */
export class TokenManager {
  /**
   * Hashers instantiated so far, keyed by their name
   */
  #hashers = new Map<TokenHasher, TokenHasherContract>()

  constructor(
    protected provider: TokenProviderContract,
    protected hash: HashManager<never>
  ) {}

  /**
   * Returns the hasher for the given name. Hashers are created once
   * and cached for the next calls.
   *
   * @param name - The name of the hasher. Defaults to "sha256"
   */
  hasher(name: TokenHasher = DEFAULT_TOKEN_HASHER): TokenHasherContract {
    const cached = this.#hashers.get(name)
    if (cached) return cached

    const hasher = this.createHasher(name)
    this.#hashers.set(name, hasher)
    return hasher
  }

  /**
   * Creates a token for a subject. Only the hash of the value is
   * persisted.
   *
   * @param tokenableId - The primary key of the subject
   * @param value - The secret value of the token
   * @param options - Options to configure the token
   */
  async create(
    tokenableId: RecordId,
    value: Secret<string>,
    options: CreateTokenOptions
  ): Promise<SentinelToken> {
    const hasher = this.hasher(options.hasher)

    /**
     * Compute the expiry date from the "expiresIn" option
     */
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
   * Verifies a value and spends one usage of the matching token. The
   * token is invalidated once expired or exhausted.
   *
   * When the lookup is narrowed to a subject using the "tokenableId"
   * option, a value matching none of its tokens counts as a failed
   * attempt against each of them.
   *
   * @param value - The secret value of the token
   * @param options - Options to find the token
   *
   * @throws {E_TOO_MANY_ATTEMPTS} When a token of the subject is
   * locked, before or by this attempt
   * @throws {E_INVALID_TOKEN} When no usable token matches the value
   */
  async verify(value: Secret<string>, options: VerifyTokenOptions): Promise<SentinelToken> {
    const hasher = this.hasher(options.hasher)
    const invalid = () => new E_INVALID_TOKEN(options.kind, options.purpose)

    /**
     * The purpose must be the one the token was created with
     */
    const token = await this.match(value, hasher, options)
    if (!token) throw invalid()
    if (token.purpose !== (options.purpose ?? null)) throw invalid()

    /**
     * Expired tokens are removed on the way
     */
    if (token.isExpired()) {
      await this.provider.invalidate(token)
      throw invalid()
    }

    /**
     * The provider refuses to mark an exhausted token as used. It
     * happens when two verifications race for the last usage.
     */
    const used = await this.provider.markAsUsed(token)
    if (!used) {
      await this.provider.invalidate(token)
      throw invalid()
    }

    /**
     * Remove the token once its last usage is spent
     */
    if (used.isExhausted()) {
      await this.provider.invalidate(used)
    }

    return used
  }

  /**
   * Invalidates the tokens of a subject
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to select the tokens to invalidate
   */
  invalidate(tokenableId: RecordId, options: InvalidateTokensOptions): Promise<void> {
    return this.provider.invalidateByTokenableId(tokenableId, options)
  }

  /**
   * Finds the token matching the value among the candidates. A failed
   * attempt is recorded against every candidate that does not match.
   *
   * Throws when a candidate is locked, before or by this attempt.
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
      /**
       * Locked tokens are removed on the way
       */
      if (candidate.isLocked()) {
        await this.provider.invalidate(candidate)
        locked = true
        continue
      }

      if (await hasher.verify(candidate.hash, plain)) return candidate
      mismatched.push(candidate)
    }

    /**
     * Record the failed attempts and find out if one of them locked
     * its token
     */
    const outcomes = await Promise.all(
      mismatched.map((candidate) => this.recordFailedAttempt(candidate))
    )

    if (locked || outcomes.includes(true)) {
      throw new E_TOO_MANY_ATTEMPTS(options.kind, options.purpose)
    }

    return null
  }

  /**
   * Records a failed attempt against the token and invalidates it
   * once locked. Returns true when the token is locked.
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
   * Returns the tokens the value may match. The lookup is narrowed to
   * the tokens of the subject when given, otherwise the token is found
   * by its hash, which requires a deterministic hasher.
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

  /**
   * Creates the hasher for the given name. The "scrypt" hasher must
   * be defined inside the "config/hash.ts" file.
   */
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
