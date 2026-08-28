import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ApplicationService } from '@adonisjs/core/types'
import type { SentinelOptions } from '../src/types.ts'
import { OTPManager } from '../modules/otp/main.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TOTPManager } from '../modules/totp/manager.ts'
import { MagicLinkManager } from '../modules/magic_link/manager.ts'
import { PasswordManager } from '../modules/password/manager.ts'
import { TOTPAuthenticator } from '../modules/totp/models/totp_authenticator.ts'

export default class SentinelProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.registerToken()
    this.registerOTP()
    this.registerTOTP()
    this.registerMagicLink()
    this.registerPassword()
  }

  /**
   * Resolves the configuration of "config/sentinel.ts". Every module is
   * optional, only the token provider has to be defined.
   */
  protected async resolveConfig(): Promise<SentinelOptions> {
    const sentinelConfigProvider = this.app.config.get('sentinel')
    const config = await configProvider.resolve<SentinelOptions>(this.app, sentinelConfigProvider)

    if (!config) {
      throw new RuntimeException(
        'Invalid "config/sentinel.ts" file. Make sure you are using the "defineConfig" method'
      )
    }

    return config
  }

  protected registerToken() {
    this.app.container.singleton(TokenManager, async (resolver) => {
      const config = await this.resolveConfig()

      return new TokenManager(config.tokens, await resolver.make('hash'))
    })

    this.app.container.alias('sentinel.tokens', TokenManager)
  }

  protected registerOTP() {
    this.app.container.singleton(OTPManager, async (resolver) => {
      const config = await this.resolveConfig()

      return new OTPManager(config.otp, await resolver.make('sentinel.tokens'))
    })

    this.app.container.alias('sentinel.otp', OTPManager)
  }

  protected registerTOTP() {
    this.app.container.singleton(TOTPManager, async (resolver) => {
      const config = await this.resolveConfig()
      const encryption = await resolver.make('encryption')

      if (!config.totp) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts". Make sure you have configure `totp`.'
        )
      }

      const manager = new TOTPManager(config.totp, encryption.use())
      TOTPAuthenticator.useManager(manager)

      return manager
    })

    this.app.container.alias('sentinel.totp', TOTPManager)
  }

  protected registerMagicLink() {
    this.app.container.singleton(MagicLinkManager, async (resolver) => {
      const config = await this.resolveConfig()

      if (!config.magicLink) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts". Make sure you have configure `magicLink`.'
        )
      }

      return new MagicLinkManager(config.magicLink, await resolver.make('sentinel.tokens'))
    })

    this.app.container.alias('sentinel.magic_link', MagicLinkManager)
  }

  protected registerPassword() {
    this.app.container.singleton(PasswordManager, async (resolver) => {
      const config = await this.resolveConfig()

      const hasher = await this.app.container.make('hash')

      return new PasswordManager(
        config.password,
        await resolver.make('sentinel.tokens'),
        hasher.use()
      )
    })

    this.app.container.alias('sentinel.password', PasswordManager)
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'sentinel.tokens': TokenManager
    'sentinel.otp': OTPManager
    'sentinel.totp': TOTPManager
    'sentinel.magic_link': MagicLinkManager
    'sentinel.password': PasswordManager
  }
}
