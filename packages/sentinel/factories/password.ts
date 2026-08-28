import { PasswordManager, PasswordManagerConfig } from '../modules/password/manager.ts'
import { Hash } from '@adonisjs/core/hash'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

export class PasswordManagerFactory {
  #tokens: TokenManager
  #hash: Hash

  constructor() {
    this.#tokens = new TokenManagerFactory().create()
    this.#hash = new HashManagerFactory().create().use('scrypt')
  }

  withTokens(manager: TokenManager) {
    this.#tokens = manager
    return this
  }

  create(config: PasswordManagerConfig = {}) {
    return new PasswordManager(config, this.#tokens, this.#hash)
  }
}
