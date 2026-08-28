import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ApplicationService } from '@adonisjs/core/types'
import { Sentinel } from '../src/sentinel.ts'
import type { SentinelOptions } from '../src/types.ts'
import { OTPManager } from '../modules/otp/main.ts'
import { TokenManager } from '../modules/token/manager.ts'

export default class SentinelProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Sentinel, async (resolver) => {
      const sentinelConfigProvider = this.app.config.get('sentinel')
      const config = await configProvider.resolve<SentinelOptions>(this.app, sentinelConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Sentinel(config, await resolver.make('hash'), await resolver.make('encryption'))
    })

    this.app.container.alias('sentinel', Sentinel)

    this.registerToken()
    this.registerOTP()
  }

  protected registerToken() {
    this.app.container.singleton(TokenManager, async (resolver) => {
      const sentinelConfigProvider = this.app.config.get('sentinel')
      const config = await configProvider.resolve<SentinelOptions>(this.app, sentinelConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new TokenManager(config.tokens, await resolver.make('hash'))
    })

    this.app.container.alias('sentinel.tokens', TokenManager)
  }

  protected registerOTP() {
    this.app.container.singleton(OTPManager, async (resolver) => {
      const sentinelConfigProvider = this.app.config.get('sentinel')
      const config = await configProvider.resolve<SentinelOptions>(this.app, sentinelConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/sentinel.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new OTPManager(
        {
          maximumFailedAttempts: 1,
          length: 6,
          expiresIn: '20m',
        },
        await resolver.make('sentinel.tokens')
      )
    })

    this.app.container.alias('sentinel.otp', OTPManager)
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'sentinel': Sentinel
    'sentinel.tokens': TokenManager
    'sentinel.otp': OTPManager
  }
}
