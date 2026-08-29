import { MagicLinkManager, MagicLinkManagerConfig } from '../modules/magic_link/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

/**
 * Magic link manager factory is used to create an instance of the
 * magic link manager for testing. Tokens are kept in memory unless a
 * token manager is given.
 */
export class MagicLinkManagerFactory {
  #tokens: TokenManager

  constructor() {
    this.#tokens = new TokenManagerFactory().create()
  }

  /**
   * Use a custom token manager
   */
  withTokens(tokens: TokenManager) {
    this.#tokens = tokens
    return this
  }

  /**
   * Create magic link manager instance
   */
  create(config: MagicLinkManagerConfig) {
    return new MagicLinkManager(config, this.#tokens)
  }
}
