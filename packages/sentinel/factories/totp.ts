import { Encryption } from '@adonisjs/core/encryption'
import { TOTPManager, TOTPManagerConfig } from '../modules/totp/manager.ts'
import { EncryptionFactory } from '@adonisjs/core/factories/encryption'

export class TOTPManagerFactory {
  #encryption: Encryption

  constructor() {
    this.#encryption = new EncryptionFactory().create()
  }

  withEncryption(encryption: Encryption) {
    this.#encryption = encryption
    return this
  }

  create(config?: TOTPManagerConfig) {
    return new TOTPManager(config, this.#encryption)
  }
}
