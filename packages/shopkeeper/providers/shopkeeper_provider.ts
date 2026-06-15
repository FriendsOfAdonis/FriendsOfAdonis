import { type ConfigProvider, type ApplicationService } from '@adonisjs/core/types'
import { Shopkeeper } from '../src/shopkeeper.js'
import { type ResolvedConfig } from '../src/types.js'
import { InvalidConfigurationError } from '../src/errors/invalid_configuration.js'
import { configProvider } from '@adonisjs/core'

export default class ShopkeeperProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Shopkeeper, async (resolver) => {
      const shopkeeperConfigProvider =
        this.app.config.get<ConfigProvider<ResolvedConfig>>('shopkeeper')
      const config = await configProvider.resolve<any>(this.app, shopkeeperConfigProvider)
      const router = await resolver.make('router')
      const emitter = await resolver.make('emitter')
      return new Shopkeeper(config, router, emitter)
    })

    this.app.container.alias('shopkeeper', Shopkeeper)
  }

  async boot() {
    const shopkeeper = await this.app.container.make('shopkeeper')

    if (shopkeeper.config.webhook.enforceSecret && !shopkeeper.config.webhook.secret) {
      throw InvalidConfigurationError.webhookSecretInProduction()
    }
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    shopkeeper: Shopkeeper
  }
}
