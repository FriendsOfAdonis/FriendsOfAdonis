import { ConfigProvider } from '@adonisjs/core/types'
import { FlickDriverContract, FlickOptions, type FlickConfig } from './types.ts'
import { configProvider } from '@adonisjs/core'
import { FlickMemoryDriver } from './drivers/memory_driver.ts'
import { FlickRedisDriver, FlickRedisDriverConfig } from './drivers/redis_driver.ts'
import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { BaseFeature } from './base_feature.ts'

/**
 * Creates a Flick configuration.
 */
export function defineConfig<
  Features extends Record<string, LazyImport<Constructor<BaseFeature>>>,
  Drivers extends Record<string, ConfigProvider<FlickDriverContract>>,
  Driver extends keyof Drivers,
>(
  config: FlickConfig<Features, Drivers, Driver>
): ConfigProvider<FlickOptions<Features, Awaited<ReturnType<Drivers[Driver]['resolver']>>>> {
  return configProvider.create(async (app) => {
    const driverProvider = config.drivers[config.driver]
    return {
      features: config.features,
      driver: (await driverProvider.resolver(app)) as Awaited<
        ReturnType<Drivers[Driver]['resolver']>
      >,
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
