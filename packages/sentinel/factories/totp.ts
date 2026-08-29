import { Encryption } from '@adonisjs/core/encryption'
import { TOTPManager, TOTPManagerConfig } from '../modules/totp/manager.ts'
import { EncryptionFactory } from '@adonisjs/core/factories/encryption'

/**
 * TOTP manager factory is used to create an instance of the TOTP
 * manager for testing
 */
export class TOTPManagerFactory {
  #encryption: Encryption

  constructor() {
    this.#encryption = new EncryptionFactory().create()
  }

  /**
   * Use a custom encryption instance
   */
  withEncryption(encryption: Encryption) {
    this.#encryption = encryption
    return this
  }

  /**
   * Create TOTP manager instance
   */
  create(config: TOTPManagerConfig = { issuer: 'FriendsOfAdonis' }) {
    return new TOTPManager(config, this.#encryption)
  }
}
