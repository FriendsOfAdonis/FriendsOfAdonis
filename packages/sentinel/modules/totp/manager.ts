import { EncryptionManager } from '@adonisjs/core/encryption'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { Secret } from '@adonisjs/core/helpers'
import { TOTP_BACKUP_CODES_PURPOSE, TOTP_SECRET_PURPOSE } from './constants.ts'
import { CreateAuthenticatorOptions } from './types.ts'
import { generateBackupCodes, generateSecret } from './utils.ts'

export interface TOTPManagerConfig extends Omit<CreateAuthenticatorOptions, 'label'> {
  /**
   * Name displayed in the user authenticator app.
   */
  issuer: string
}

/**
 * Encrypts and decrypts the secrets held by the TOTP authenticators.
 *
 * Backup codes live on the authenticator row rather than in the tokens
 * table: they never expire, they must die with their authenticator and
 * they have to survive a cleanup of the tokens. They are encrypted
 * rather than hashed because they are no more powerful than the secret
 * they sit next to, which is itself reversible. Verification stays
 * cheap and the codes can be displayed again.
 */
export class TOTPManager {
  constructor(private encryption: EncryptionManager<any>) {}

  /**
   * Generates a secret of "length" random bytes, encoded in the base32
   * form expected by the authenticator applications.
   */
  createSecret(length: number) {
    const secret = generateSecret(length)
    const encryptedSecret = this.encryption.encrypt(secret, { purpose: TOTP_SECRET_PURPOSE })
    return { secret, encryptedSecret }
  }

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
   * Generates backup codes along with their encrypted form. Persisting
   * them is left to the caller.
   */
  createBackupCodes(count: number, length: number) {
    const codes = generateBackupCodes(count, length)
    return { codes, encryptedCodes: this.encryptBackupCodes(codes) }
  }

  encryptBackupCodes(codes: string[]) {
    return this.encryption.encrypt(codes, { purpose: TOTP_BACKUP_CODES_PURPOSE })
  }

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
