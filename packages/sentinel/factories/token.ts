import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { TokenManager } from '../modules/token/manager.ts'
import { FakeMemoryTokenProvider } from '../modules/token/providers/fake.ts'
import { TokenProviderContract } from '../modules/token/types.ts'
import { HashManager } from '@adonisjs/core/hash'

export class TokenManagerFactory {
  #provider: TokenProviderContract = new FakeMemoryTokenProvider()
  #hash: HashManager<never>

  constructor() {
    this.#provider = new FakeMemoryTokenProvider()
    this.#hash = new HashManagerFactory<never>().create()
  }

  withProvider(provider: TokenProviderContract) {
    this.#provider = provider
    return this
  }

  withHash(hash: HashManager<never>) {
    this.#hash = hash
    return this
  }

  create() {
    return new TokenManager(this.#provider, this.#hash)
  }
}
