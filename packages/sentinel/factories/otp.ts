import { OTPManager, OTPManagerConfig } from '../modules/otp/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

/**
 * OTP manager factory is used to create an instance of the OTP
 * manager for testing. Tokens are kept in memory unless a token
 * manager is given.
 */
export class OTPManagerFactory {
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
   * Create OTP manager instance
   */
  create(config: OTPManagerConfig = {}) {
    return new OTPManager(config, this.#tokens)
  }
}
