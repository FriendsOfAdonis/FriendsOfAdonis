import { ConfigProvider } from '@adonisjs/core/types'
import { FlickDriverContract, FlickOptions, type FlickConfig } from './types.ts'
import { configProvider } from '@adonisjs/core'
import { FlickMemoryDriver } from './drivers/memory_driver.ts'
import { FlickRedisDriver, FlickRedisDriverConfig } from './drivers/redis_driver.ts'

/**
 * Creates a Flick configuration.
 */
export function defineConfig<Drivers extends Record<string, ConfigProvider<FlickDriverContract>>>(
  config: FlickConfig<Drivers>
): ConfigProvider<FlickOptions> {
  return configProvider.create(async (app) => {
    const driverProvider = config.drivers[config.driver]
    return {
      features: config.features,
      driver: await driverProvider.resolver(app),
    }
  })
}

export const drivers: {
  memory: () => ConfigProvider<FlickMemoryDriver>
  redis: (options: FlickRedisDriverConfig) => ConfigProvider<FlickRedisDriver>
} = {
  memory: () =>
    configProvider.create(async () => {
      const { FlickMemoryDriver } = await import('./drivers/memory_driver.ts')
      return new FlickMemoryDriver()
    }),
  redis: (options: FlickRedisDriverConfig) =>
    configProvider.create(async (app) => {
      const { FlickRedisDriver } = await import('./drivers/redis_driver.ts')

      const redis = await app.container.make('redis')

      return new FlickRedisDriver({
        connection: redis.connection(options.connection),
        prefix: options.prefix ?? 'flick',
      })
    }),
}
