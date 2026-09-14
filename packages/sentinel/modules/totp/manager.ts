import { Encryption } from '@adonisjs/core/encryption'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { Secret } from '@adonisjs/core/helpers'
import {
  TOTP_BACKUP_CODES_PURPOSE,
  TOTP_DEFAULT_BACKUP_CODES_COUNT,
  TOTP_DEFAULT_BACKUP_CODES_LENGTH,
  TOTP_DEFAULT_SECRET_LENGTH,
  TOTP_SECRET_PURPOSE,
} from './constants.ts'
import { AuthenticatorOptions } from './types.ts'
import { generateBackupCodes, generateSecret } from './utils.ts'

/**
 * Config accepted by the TOTP manager. The options can be overridden
 * by the "withTOTP" mixin, then by the options of each call.
 */
export interface TOTPManagerConfig extends AuthenticatorOptions {}

/**
 * TOTP manager generates the secrets and the backup codes of the
 * authenticators and encrypts them for storage.
 *
 * Backup codes live on the authenticator row rather than in the
 * tokens table: they never expire, die with their authenticator and
 * must survive a cleanup of the tokens. They are encrypted rather
 * than hashed, so that they can be displayed again. It is no weaker
 * than the secret stored next to them, which is reversible anyway.
 *
 * @example
 * const { secret, encryptedSecret } = totp.createSecret()
 * const { codes, encryptedCodes } = totp.createBackupCodes()
 */
export class TOTPManager {
  constructor(
    readonly config: TOTPManagerConfig,
    private encryption: Encryption
  ) {}

  /**
   * Creates a random secret and its encrypted form to persist.
   *
   * @param length - The number of random bytes. The base32 encoded
   * secret is longer. Defaults to "config.secretLength", then 40
   */
  createSecret(length: number = this.config.secretLength ?? TOTP_DEFAULT_SECRET_LENGTH) {
    const secret = new Secret(generateSecret(length))
    const encryptedSecret = this.encryption.encrypt(secret.release(), {
      purpose: TOTP_SECRET_PURPOSE,
    })

    return { secret, encryptedSecret }
  }

  /**
   * Decrypts a persisted secret. Throws when it was encrypted with a
   * different application key.
   */
  decryptSecret(encrypted: string) {
    const secret = this.encryption.decrypt<string>(encrypted, TOTP_SECRET_PURPOSE)
    if (!secret) {
      throw new RuntimeException(
        'Cannot decrypt the secret of the authenticator. It has been encrypted with a different application key'
      )
    }

    return new Secret(secret)
  }

  /**
   * Creates random backup codes and their encrypted form to persist.
   *
   * @param count - The number of codes. Defaults to
   * "config.backupCodesCount", then 10
   * @param length - The number of characters of a code, separator
   * aside. Defaults to "config.backupCodesLength", then 10
   */
  createBackupCodes(
    count: number = this.config.backupCodesCount ?? TOTP_DEFAULT_BACKUP_CODES_COUNT,
    length: number = this.config.backupCodesLength ?? TOTP_DEFAULT_BACKUP_CODES_LENGTH
  ) {
    const codes = generateBackupCodes(count, length)
    return { codes, encryptedCodes: this.encryptBackupCodes(codes) }
  }

  /**
   * Encrypts backup codes for storage
   */
  encryptBackupCodes(codes: string[]) {
    return this.encryption.encrypt(codes, { purpose: TOTP_BACKUP_CODES_PURPOSE })
  }

  /**
   * Decrypts persisted backup codes. Throws when they were encrypted
   * with a different application key.
   */
  decryptBackupCodes(encrypted: string) {
    const codes = this.encryption.decrypt<string[]>(encrypted, TOTP_BACKUP_CODES_PURPOSE)
    if (!codes) {
      throw new RuntimeException(
        'Cannot decrypt the backup codes of the authenticator. They have been encrypted with a different application key'
      )
    }

    return codes
  }
}
