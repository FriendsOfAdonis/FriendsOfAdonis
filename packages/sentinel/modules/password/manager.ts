import type { Hash } from '@adonisjs/core/hash'
import { Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import type { RecordId } from '../../src/types.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import type { TokenManager } from '../token/manager.ts'
import type { SentinelToken } from '../token/token.ts'
import { DEFAULT_PASSWORD_EXPIRES_IN } from './constants.ts'
import type {
  GeneratePasswordResetTokenOptions,
  InvalidatePasswordResetTokensOptions,
  VerifyPasswordResetTokenOptions,
} from './types.ts'
import { WithPasswordOptions } from './main.ts'
import { withPassword } from './mixins/with_password.ts'

export interface PasswordManagerConfig {
  /**
   * Expiration of the password reset tokens.
   *
   * @default "1h"
   */
  expiresIn?: string | number
}

/**
 * Hashes and verifies passwords, and issues the single-use tokens of
 * the "forgot password" flow. Passwords are written to the models by
 * the "withPassword" mixin.
 */
export class PasswordManager {
  static TOKEN_KIND = 'password_reset'

  #hash: Hash

  constructor(
    protected config: PasswordManagerConfig = {},
    protected tokens: TokenManager,
    protected hash: Hash
  ) {
    this.#hash = hash
  }

  /**
   * Hashes a password with the configured hasher.
   */
  hashPassword(password: string): Promise<string> {
    return this.#hash.make(password)
  }

  /**
   * Verifies a password against a persisted hash.
   */
  verifyPassword(hash: string, password: string): Promise<boolean> {
    return this.#hash.verify(hash, password)
  }

  /**
   * Whether a persisted hash was created with outdated options and
   * should be computed again.
   */
  needsRehash(hash: string): boolean {
    return this.#hash.needsReHash(hash)
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
      expiresIn: options.expiresIn ?? this.config.expiresIn ?? DEFAULT_PASSWORD_EXPIRES_IN,
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

  withPassword = (options: WithPasswordOptions = {}) => withPassword(this, options)
}
