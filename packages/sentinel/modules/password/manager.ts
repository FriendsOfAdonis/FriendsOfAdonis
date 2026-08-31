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
import { withPassword, WithPasswordOptions } from './mixins/with_password.ts'

/**
 * Config accepted by the password manager
 */
export interface PasswordManagerConfig {
  /**
   * The lifetime of the password reset tokens, in seconds or as a
   * duration string like "1h".
   *
   * Defaults to "1h"
   */
  expiresIn?: string | number
}

/**
 * Password manager hashes and verifies passwords using the default
 * hasher of "config/hash.ts", and manages the password reset tokens.
 *
 * @example
 * const token = await password.generatePasswordResetToken(user.id)
 * await password.verifyPasswordResetToken(token)
 */
export class PasswordManager {
  /**
   * The kind under which the reset tokens are persisted
   */
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
   * Hashes a plain password
   */
  hashPassword(password: string): Promise<string> {
    return this.#hash.make(password)
  }

  /**
   * Verifies a plain password against its hash
   */
  verifyPassword(hash: string, password: string): Promise<boolean> {
    return this.#hash.verify(hash, password)
  }

  /**
   * Check if the hash was made with outdated options and should be
   * computed again
   */
  needsRehash(hash: string): boolean {
    return this.#hash.needsReHash(hash)
  }

  /**
   * Creates a password reset token for a subject and returns its
   * value, the only copy of it. Only the hash is persisted.
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to configure the token
   */
  async generatePasswordResetToken(
    tokenableId: RecordId,
    options: GeneratePasswordResetTokenOptions = {}
  ) {
    /**
     * Suffix the random seed with its checksum, so that secret
     * scanning tools recognize the token
     */
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
   * Verifies a password reset token and consumes it, so that
   * verifying it again fails.
   *
   * @param value - The value of the token
   * @param options - Options to find the token
   *
   * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
   * already used, or was created for another purpose
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
   * Invalidates the password reset tokens of a subject
   *
   * @param tokenableId - The primary key of the subject
   * @param options - Options to select the tokens to invalidate
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

  /**
   * Invalidates the password reset tokens of a subject, whatever
   * their purpose. The mixin calls it once a password is set, since
   * a pending reset token is a way in until it expires.
   *
   * @param tokenableId - The primary key of the subject
   */
  invalidateAllPasswordResetTokens(tokenableId: RecordId): Promise<void> {
    return this.tokens.invalidateAll(tokenableId, { kind: PasswordManager.TOKEN_KIND })
  }

  /**
   * Mixin to add password hashing, verification and reset tokens to
   * a Lucid model. See "withPassword" for the details.
   *
   * @example
   * class User extends compose(BaseModel, password.withPassword()) {}
   */
  withPassword = (options: WithPasswordOptions = {}) => withPassword(this, options)
}
