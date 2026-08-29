import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { TokenManager } from '../modules/token/manager.ts'
import { FakeMemoryTokenProvider } from '../modules/token/providers/fake.ts'
import { TokenProviderContract } from '../modules/token/types.ts'
import { HashManager } from '@adonisjs/core/hash'

/**
 * Token manager factory is used to create an instance of the token
 * manager for testing. Tokens are kept in memory unless a provider
 * is given.
 */
export class TokenManagerFactory {
  #provider: TokenProviderContract = new FakeMemoryTokenProvider()
  #hash: HashManager<never>

  constructor() {
    this.#provider = new FakeMemoryTokenProvider()
    this.#hash = new HashManagerFactory<never>().create()
  }

  /**
   * Use a custom token provider
   */
  withProvider(provider: TokenProviderContract) {
    this.#provider = provider
    return this
  }

  /**
   * Use a custom hash manager
   */
  withHash(hash: HashManager<never>) {
    this.#hash = hash
    return this
  }

  /**
   * Create token manager instance
   */
  create() {
    return new TokenManager(this.#provider, this.#hash)
  }
}
