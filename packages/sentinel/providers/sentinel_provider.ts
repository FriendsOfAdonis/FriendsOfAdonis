import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ApplicationService } from '@adonisjs/core/types'
import type { SentinelOptions } from '../src/types.ts'
import { EmailManager } from '../modules/email/manager.ts'
import { OTPManager } from '../modules/otp/main.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { TOTPManager } from '../modules/totp/manager.ts'
import { MagicLinkManager } from '../modules/magic_link/manager.ts'
import { PasswordManager } from '../modules/password/manager.ts'

/**
 * Registers the sentinel managers with the container
 *
 * Each manager is registered as a singleton resolved from the
 * "config/sentinel.ts" file and aliased under the "sentinel.*"
 * namespace. The OTP, magic link and password managers share the
 * token manager to persist their tokens.
 *
 * @example
 * const tokens = await app.container.make('sentinel.tokens')
 * const password = await app.container.make(PasswordManager)
 */
export default class SentinelProvider {
  /**
   * Sentinel service provider constructor
   *
   * @param app - The application service instance
   */
  constructor(protected app: ApplicationService) {}

  /**
   * Registers bindings
   */
  register() {
    this.registerToken()
    this.registerOTP()
    this.registerTOTP()
    this.registerMagicLink()
    this.registerPassword()
    this.registerEmail()
  }

  /**
   * Resolves the config from the config provider created by the
   * "defineConfig" method. Throws when the config file does not
   * use it.
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

  /**
   * Registers the token manager with the container. The manager
   * hashes tokens using the hash manager from "config/hash.ts".
   */
  protected registerToken() {
    this.app.container.singleton(TokenManager, async (resolver) => {
      const config = await this.resolveConfig()

      return new TokenManager(config.tokens, await resolver.make('hash'))
    })

    this.app.container.alias('sentinel.tokens', TokenManager)
  }

  /**
   * Registers the OTP manager with the container
   */
  protected registerOTP() {
    this.app.container.singleton(OTPManager, async (resolver) => {
      const config = await this.resolveConfig()

      return new OTPManager(config.otp, await resolver.make('sentinel.tokens'))
    })

    this.app.container.alias('sentinel.otp', OTPManager)
  }

  /**
   * Registers the TOTP manager with the container. Throws when the
   * "totp" config is missing, since the issuer is required.
   */
  protected registerTOTP() {
    this.app.container.singleton(TOTPManager, async (resolver) => {
      const config = await this.resolveConfig()
      const encryption = await resolver.make('encryption')

      if (!config.totp) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts". Make sure you have configured "totp".'
        )
      }

      return new TOTPManager(config.totp, encryption.use())
    })

    this.app.container.alias('sentinel.totp', TOTPManager)
  }

  /**
   * Registers the magic link manager with the container. Throws when
   * the "magicLink" config is missing, since the URL is required.
   */
  protected registerMagicLink() {
    this.app.container.singleton(MagicLinkManager, async (resolver) => {
      const config = await this.resolveConfig()

      if (!config.magicLink) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts". Make sure you have configured "magicLink".'
        )
      }

      return new MagicLinkManager(config.magicLink, await resolver.make('sentinel.tokens'))
    })

    this.app.container.alias('sentinel.magic_link', MagicLinkManager)
  }

  /**
   * Registers the password manager with the container. Passwords are
   * hashed using the default hasher from "config/hash.ts".
   */
  protected registerPassword() {
    this.app.container.singleton(PasswordManager, async (resolver) => {
      const config = await this.resolveConfig()

      const hasher = await resolver.make('hash')
      const tokens = await resolver.make('sentinel.tokens')

      return new PasswordManager(config.password, tokens, hasher.use())
    })

    this.app.container.alias('sentinel.password', PasswordManager)
  }

  /**
   * Registers the email manager with the container
   */
  protected registerEmail() {
    this.app.container.singleton(EmailManager, async (resolver) => {
      const config = await this.resolveConfig()

      return new EmailManager(config.email, await resolver.make('sentinel.tokens'))
    })

    this.app.container.alias('sentinel.email', EmailManager)
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'sentinel.tokens': TokenManager
    'sentinel.otp': OTPManager
    'sentinel.totp': TOTPManager
    'sentinel.magic_link': MagicLinkManager
    'sentinel.password': PasswordManager
    'sentinel.email': EmailManager
  }
}
