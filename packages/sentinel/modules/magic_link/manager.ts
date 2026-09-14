import { Secret } from '@adonisjs/core/helpers'
import type { RecordId } from '../../src/types.ts'
import type { TokenManager } from '../token/manager.ts'
import type { SentinelToken } from '../token/token.ts'
import { makeTokenValue } from '../token/value.ts'
import type {
  GenerateMagicLinkOptions,
  GenerateMagicLinkTokenOptions,
  InvalidateMagicLinkTokensOptions,
  MagicLinkUrlBuilder,
  VerifyMagicLinkTokenOptions,
} from './types.ts'
import { MAGIC_LINK_DEFAULT_EXPIRES_IN } from './constants.ts'

/**
 * Config accepted by the magic link manager
 */
export interface MagicLinkManagerConfig {
  /**
   * Builds the URL of the links from their token. The URL must be
   * absolute, since the links are sent by email.
   *
   * @example
   * url: (token) => `https://example.com/auth/magic-link?token=${token}`
   */
  url: MagicLinkUrlBuilder

  /**
   * The lifetime of the links, in seconds or as a duration string
   * like "20m".
   *
   * Defaults to "20m"
   */
  expiresIn?: string | number
}

/**
 * Magic link manager generates and verifies the tokens of the
 * passwordless login links.
 *
 * @example
 * const link = await magicLink.generateMagicLink(user.id)
 * await magicLink.verifyMagicLinkToken(token)
 */
export class MagicLinkManager {
  /**
   * The kind under which the tokens are persisted
   */
  static TOKEN_KIND = 'magic_link'

  constructor(
    protected config: MagicLinkManagerConfig,
    protected tokens: TokenManager
  ) {}

  /**
   * Creates a token for a subject and returns the link carrying it.
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to configure the link and its token
   */
  async generateMagicLink(tokenableId: RecordId, options: GenerateMagicLinkOptions = {}) {
    const url = options.url ?? this.config.url
    const value = makeTokenValue()

    /**
     * The link is built and checked before the token is persisted, so
     * that a relative URL or a throwing builder leaves nothing behind
     */
    const link = url(value.release())
    new URL(link)

    await this.#persist(tokenableId, value, options)

    return new Secret(link)
  }

  /**
   * Creates a token for a subject and returns its value, the only
   * copy of it. Only the hash is persisted.
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to configure the token
   */
  async generateMagicLinkToken(tokenableId: RecordId, options: GenerateMagicLinkTokenOptions = {}) {
    const value = makeTokenValue()
    await this.#persist(tokenableId, value, options)

    return value
  }

  /**
   * Persists the hash of a token value for a subject
   */
  #persist(tokenableId: RecordId, value: Secret<string>, options: GenerateMagicLinkTokenOptions) {
    return this.tokens.create(tokenableId, value, {
      kind: MagicLinkManager.TOKEN_KIND,
      purpose: options.purpose,
      expiresIn: options.expiresIn ?? this.config.expiresIn ?? MAGIC_LINK_DEFAULT_EXPIRES_IN,
      metadata: options.metadata,
    })
  }

  /**
   * Verifies a token and consumes it, so that verifying it again
   * fails.
   *
   * @param value - The value of the token
   * @param options - Options to find the token
   *
   * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
   * already used, or was created for another purpose
   */
  async verifyMagicLinkToken(
    value: Secret<string> | string,
    options: VerifyMagicLinkTokenOptions = {}
  ): Promise<SentinelToken> {
    return this.tokens.verify(typeof value === 'string' ? new Secret(value) : value, {
      kind: MagicLinkManager.TOKEN_KIND,
      purpose: options.purpose,
    })
  }

  /**
   * Invalidates the magic link tokens of a subject, so that its
   * pending links stop working.
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to select the tokens to invalidate
   */
  invalidateMagicLinkTokens(
    tokenableId: RecordId,
    options: InvalidateMagicLinkTokensOptions = {}
  ): Promise<void> {
    return this.tokens.invalidate(tokenableId, {
      kind: MagicLinkManager.TOKEN_KIND,
      purpose: options.purpose,
    })
  }
}
