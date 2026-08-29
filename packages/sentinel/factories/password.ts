import { PasswordManager, PasswordManagerConfig } from '../modules/password/manager.ts'
import { Hash } from '@adonisjs/core/hash'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

/**
 * Password manager factory is used to create an instance of the
 * password manager for testing. Passwords are hashed with scrypt and
 * tokens are kept in memory unless a token manager is given.
 */
export class PasswordManagerFactory {
  #tokens: TokenManager
  #hash: Hash

  constructor() {
    this.#tokens = new TokenManagerFactory().create()
    this.#hash = new HashManagerFactory().create().use('scrypt')
  }

  /**
   * Use a custom token manager
   */
  withTokens(manager: TokenManager) {
    this.#tokens = manager
    return this
  }

  /**
   * Create password manager instance
   */
  create(config: PasswordManagerConfig = {}) {
    return new PasswordManager(config, this.#tokens, this.#hash)
  }
}
