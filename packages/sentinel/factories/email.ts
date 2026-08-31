import { EmailManager, EmailManagerConfig } from '../modules/email/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

/**
 * Email manager factory is used to create an instance of the email
 * manager for testing. Tokens are kept in memory unless a token
 * manager is given.
 */
export class EmailManagerFactory {
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
   * Create email manager instance
   */
  create(config: EmailManagerConfig = {}) {
    return new EmailManager(config, this.#tokens)
  }
}
