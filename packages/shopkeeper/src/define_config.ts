import { configProvider } from '@adonisjs/core'
import { type ResolvedConfig, type ShopkeeperConfig } from './types.js'
import { type ConfigProvider } from '@adonisjs/core/types'

export function defineConfig(config: ShopkeeperConfig): ConfigProvider<ResolvedConfig> {
  return configProvider.create(async () => {
    const [customerModel, subscriptionModel, subscriptionItemModel] = await Promise.all([
      config.models.customerModel().then((i) => i.default),
      config.models.subscriptionModel().then((i) => i.default),
      config.models.subscriptionItemModel().then((i) => i.default),
    ])

    return {
      ...config,
      models: {
        customerModel,
        subscriptionModel,
        subscriptionItemModel,
      },
    }
  })
}
