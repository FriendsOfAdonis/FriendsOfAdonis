import { MagicLinkManager, MagicLinkManagerConfig } from '../modules/magic_link/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

export class MagicLinkManagerFactory {
  #tokens: TokenManager

  constructor() {
    this.#tokens = new TokenManagerFactory().create()
  }

  withTokens(tokens: TokenManager) {
    this.#tokens = tokens
    return this
  }

  create(config: MagicLinkManagerConfig) {
    return new MagicLinkManager(config, this.#tokens)
  }
}
