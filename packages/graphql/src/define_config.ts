import { type ConfigProvider } from '@adonisjs/core/types'
import type { ApolloDriver, ApolloDriverConfig } from './drivers/apollo_driver.js'
import type { YogaDriver, YogaDriverConfig } from './drivers/yoga_driver.js'
import {
  type GraphQLOptions,
  type GraphQLConfig,
  type GraphQLDriverContract,
  type PubSubDriverContract,
  type SubscriptionDriverContract,
} from './types.js'
import { configProvider } from '@adonisjs/core'
import { type Logger } from '@adonisjs/core/logger'
import type { RedisPubSub, RedisPubSubConfig } from './drivers/pubsub/redis_pubsub_driver.js'
import type { NativePubSub, NativePubSubConfig } from './drivers/pubsub/native_pubsub_driver.js'
import {
  type WebsocketSubscriptionDriver,
  type WebsocketSubscriptionDriverConfig,
} from './drivers/subscription/websocket_subscription_driver.ts'

export function defineConfig<
  KnownDriver extends GraphQLDriverContract,
  KnownPubSubDriver extends PubSubDriverContract,
  KnownSubscriptionDriver extends SubscriptionDriverContract,
>({
  driver,
  pubSub,
  subscription,
  ...config
}: GraphQLConfig<KnownDriver, KnownPubSubDriver, KnownSubscriptionDriver>): ConfigProvider<
  GraphQLOptions<KnownDriver, KnownPubSubDriver, KnownSubscriptionDriver>
> {
  return configProvider.create(async (app) => {
    const loggerService = await app.container.make('logger')
    const logger = config.logger ? loggerService.use(config.logger) : loggerService.use()

    return {
      driver: await driver.resolver(app).then((factory) => factory(logger)),
      pubSub: pubSub ? await pubSub.resolver(app).then((factory) => factory()) : undefined,
      subscription: subscription
        ? await subscription.resolver(app).then((factory) => factory())
        : undefined,
      ...config,
    }
  })
}

export const drivers: {
  apollo: (config: ApolloDriverConfig) => ConfigProvider<(logger: Logger) => ApolloDriver>
  yoga: (config: YogaDriverConfig) => ConfigProvider<(logger: Logger) => YogaDriver>

  pubsub: {
    native: (config?: NativePubSubConfig) => ConfigProvider<() => NativePubSub>
    redis: (config?: RedisPubSubConfig) => ConfigProvider<() => RedisPubSub>
  }

  subscription: {
    websocket: (
      config: WebsocketSubscriptionDriverConfig
    ) => ConfigProvider<() => WebsocketSubscriptionDriver>
  }
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

  pubsub: {
    native(config) {
      return configProvider.create(async () => {
        const { NativePubSub } = await import('./drivers/pubsub/native_pubsub_driver.js')
        return () => new NativePubSub(config)
      })
    },
    redis(config) {
      return configProvider.create(async () => {
        const { RedisPubSub } = await import('./drivers/pubsub/redis_pubsub_driver.js')
        return () => new RedisPubSub(config)
      })
    },
  },

  subscription: {
    websocket(config) {
      return configProvider.create(async (app) => {
        const { WebsocketSubscriptionDriver } =
          await import('./drivers/subscription/websocket_subscription_driver.ts')

        const httpServer = await app.container.make('server')

        return () => new WebsocketSubscriptionDriver(config, httpServer, app.container)
      })
    },
  },
}
