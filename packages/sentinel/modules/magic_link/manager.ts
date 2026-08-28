import { RuntimeException } from '@adonisjs/core/exceptions'
import { Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import type { RecordId } from '../../src/types.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import type { TokenManager } from '../token/manager.ts'
import type { SentinelToken } from '../token/token.ts'
import type {
  GenerateMagicLinkOptions,
  GenerateMagicLinkTokenOptions,
  VerifyMagicLinkTokenOptions,
} from './types.ts'

export interface MagicLinkManagerConfig {
  /**
   * Expiration of the token.
   */
  expiresIn: string | number

  /**
   * URL of the endpoint consuming the link.
   */
  url: string
}

export class MagicLinkManager {
  static TOKEN_KIND = 'magic_link'

  constructor(
    protected config: MagicLinkManagerConfig,
    protected tokens: TokenManager
  ) {}

  /**
   * Generates a magic link token for the given subject and returns the
   * link pointing to the consuming endpoint.
   */
  async generateMagicLink(tokenableId: RecordId, options: GenerateMagicLinkOptions = {}) {
    const base = options.url ?? this.config.url

    if (!base) {
      throw new RuntimeException(
        'Cannot generate a magic link without a URL. Define "magicLink.url" inside "config/sentinel.ts" or pass the "url" option'
      )
    }

    const url = new URL(base)
    const token = await this.generateMagicLinkToken(tokenableId, options)
    url.searchParams.set('token', token.release())

    return new Secret(url.href)
  }

  /**
   * Generates a magic link token for the given subject. Only the hash
   * is persisted, the returned value is the only copy of the token.
   */
  async generateMagicLinkToken(tokenableId: RecordId, options: GenerateMagicLinkTokenOptions = {}) {
    const seed = string.random(40)
    const value = new Secret(`${seed}${new CRC32().calculate(seed)}`)

    await this.tokens.create(tokenableId, value, {
      kind: MagicLinkManager.TOKEN_KIND,
      purpose: options.purpose,
      expiresIn: options.expiresIn || this.config.expiresIn,
      metadata: options.metadata,
    })

    return value
  }

  /**
   * Verifies a magic link token and consumes it. The returned token
   * carries the subject (`tokenableId`) and the metadata given at
   * generation time.
   *
   * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
   * already used or generated for a different purpose.
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
}
