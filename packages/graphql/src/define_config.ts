import { ConfigProvider } from '@adonisjs/core/types'
import type { ApolloDriver, ApolloDriverConfig } from './drivers/apollo_driver.js'
import type { YogaDriver, YogaDriverConfig } from './drivers/yoga_driver.js'
import { GraphQLConfig, GraphQLDriverContract } from './types.js'
import { configProvider } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

type ResolvedConfig<KnownDriver extends GraphQLDriverContract> = {
  driver: KnownDriver
}

export function defineConfig<KnownDriver extends GraphQLDriverContract>({
  driver,
  ...config
}: GraphQLConfig & {
  driver: ConfigProvider<(logger: Logger) => KnownDriver>
}): ConfigProvider<ResolvedConfig<KnownDriver>> {
  return configProvider.create(async (app) => {
    const loggerService = await app.container.make('logger')
    const logger = config.logger ? loggerService.use(config.logger) : loggerService.use()
    const factory = await driver.resolver(app)

    return {
      driver: factory(logger),
      ...config,
    }
  })
}

export const drivers: {
  apollo: (config: ApolloDriverConfig) => ConfigProvider<(logger: Logger) => ApolloDriver>
  yoga: (config: YogaDriverConfig) => ConfigProvider<(logger: Logger) => YogaDriver>
} = {
  apollo(config) {
    return configProvider.create(async () => {
      const { ApolloDriver } = await import('./drivers/apollo_driver.js')
      return (logger: Logger) => new ApolloDriver(config, logger)
    })
  },
  yoga(config) {
    return configProvider.create(async () => {
      const { YogaDriver } = await import('./drivers/yoga_driver.js')
      return (logger: Logger) => new YogaDriver(config, logger)
    })
  },
}
