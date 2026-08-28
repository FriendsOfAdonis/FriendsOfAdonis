import { RuntimeException } from '@adonisjs/core/exceptions'
import type { Hash, HashManager } from '@adonisjs/core/hash'
import { Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import type { RecordId } from '../../src/types.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import type { TokenManager } from '../token/manager.ts'
import type { SentinelToken } from '../token/token.ts'
import type {
  GeneratePasswordResetTokenOptions,
  InvalidatePasswordResetTokensOptions,
  VerifyPasswordResetTokenOptions,
} from './types.ts'
import { HashersList } from '@adonisjs/core/types'

export interface PasswordManagerConfig {
  /**
   * Expiration of the password reset tokens.
   */
  expiresIn: string | number

  /**
   * Hasher used to hash passwords, among the ones defined inside
   * `config/hash.ts`.
   *
   * @default the default hasher of "config/hash.ts"
   */
  hasher?: keyof HashersList
}

/**
 * Hashes and verifies passwords, and issues the single-use tokens of
 * the "forgot password" flow. Passwords are written to the models by
 * the "withPassword" mixin.
 */
export class PasswordManager {
  static TOKEN_KIND = 'password_reset'

  #hasher: Hash

  constructor(
    protected config: PasswordManagerConfig,
    protected tokens: TokenManager,
    hash: HashManager<never>
  ) {
    if (config.hasher && !(config.hasher in hash.config.list)) {
      throw new RuntimeException(
        `Cannot hash passwords with "${config.hasher}". Make sure a "${config.hasher}" hasher is defined inside the "config/hash.ts" file`
      )
    }

    this.#hasher = hash.use(config.hasher)
  }

  /**
   * Hashes a password with the configured hasher.
   */
  hashPassword(password: string): Promise<string> {
    return this.#hasher.make(password)
  }

  /**
   * Verifies a password against a persisted hash.
   */
  verifyPassword(hash: string, password: string): Promise<boolean> {
    return this.#hasher.verify(hash, password)
  }

  /**
   * Whether a persisted hash was created with outdated options and
   * should be computed again.
   */
  needsRehash(hash: string): boolean {
    return this.#hasher.needsReHash(hash)
  }

  /**
   * Generates a password reset token for the given subject. Only the
   * hash is persisted, the returned value is the only copy of the token.
   */
  async generatePasswordResetToken(
    tokenableId: RecordId,
    options: GeneratePasswordResetTokenOptions = {}
  ) {
    const seed = string.random(40)
    const value = new Secret(`${seed}${new CRC32().calculate(seed)}`)

    await this.tokens.create(tokenableId, value, {
      kind: PasswordManager.TOKEN_KIND,
      purpose: options.purpose,
      expiresIn: options.expiresIn || this.config.expiresIn,
      metadata: options.metadata,
    })

    return value
  }

  /**
   * Verifies a password reset token and consumes it. The returned token
   * carries the subject (`tokenableId`) and the metadata given at
   * generation time.
   *
   * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
   * already used or generated for a different purpose.
   */
  async verifyPasswordResetToken(
    value: Secret<string> | string,
    options: VerifyPasswordResetTokenOptions = {}
  ): Promise<SentinelToken> {
    return this.tokens.verify(typeof value === 'string' ? new Secret(value) : value, {
      kind: PasswordManager.TOKEN_KIND,
      purpose: options.purpose,
    })
  }

  /**
   * Invalidates the pending password reset tokens of the given subject,
   * so that tokens issued before a password was reset or updated can no
   * longer be used.
   */
  invalidatePasswordResetTokens(
    tokenableId: RecordId,
    options: InvalidatePasswordResetTokensOptions = {}
  ): Promise<void> {
    return this.tokens.invalidate(tokenableId, {
      kind: PasswordManager.TOKEN_KIND,
      purpose: options.purpose,
    })
  }
}
