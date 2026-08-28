import { OTPManager, OTPManagerConfig } from '../modules/otp/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TokenManagerFactory } from './token.ts'

export class OTPManagerFactory {
  #config: OTPManagerConfig
  #tokens: TokenManager

  constructor() {
    this.#config = {
      length: 6,
      expiresIn: '20m',
      maximumFailedAttempts: 3,
    }

    this.#tokens = new TokenManagerFactory().create()
  }

  withConfig(config: OTPManagerConfig) {
    this.#config = config
    return this
  }

  withTokens(tokens: TokenManager) {
    this.#tokens = tokens
    return this
  }

  create(): OTPManager {
    return new OTPManager(this.#config, this.#tokens)
  }
}
