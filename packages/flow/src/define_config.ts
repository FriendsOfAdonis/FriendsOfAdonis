import { ConfigProvider, LoggersList } from '@adonisjs/core/types'
import type { BullMQAdapter, BullMQAdapterConfig } from './adapters/bullmq_adapter.js'
import { configProvider } from '@adonisjs/core'
import { AdapterContract, AdapterFactory, FlowConfig } from './types.js'
import { Logger } from '@adonisjs/core/logger'
import type { MemoryAdapter } from './adapters/memory_adapter.js'

export type ResolvedConfig<KnownAdapter extends AdapterContract> = Omit<FlowConfig, 'logger'> & {
  adapter: AdapterFactory<KnownAdapter>
  logger: Logger
  autoload: URL
}

export function defineConfig<KnownAdapter extends AdapterContract>({
  adapter,
  logger: loggerName,
  ...config
}: FlowConfig & {
  adapter: ConfigProvider<AdapterFactory<KnownAdapter>>
  logger?: keyof LoggersList
}): ConfigProvider<ResolvedConfig<KnownAdapter>> {
  return configProvider.create(async (app) => {
    const loggerService = await app.container.make('logger')
    const logger = loggerName ? loggerService.use(loggerName) : loggerService.use()

    const path = app.makeURL('app/workflows')

    return {
      adapter: await adapter.resolver(app),
      logger,
      autoload: path,
      ...config,
    }
  })
}

export const adapters: {
  memory: () => ConfigProvider<AdapterFactory<MemoryAdapter>>
  bullmq: (config: BullMQAdapterConfig) => ConfigProvider<AdapterFactory<BullMQAdapter>>
} = {
  memory() {
    return configProvider.create(async () => {
      const { MemoryAdapter } = await import('./adapters/memory_adapter.js')
      return (runtime) => new MemoryAdapter(runtime)
    })
  },
  bullmq(config) {
    return configProvider.create(async () => {
      const { BullMQAdapter } = await import('./adapters/bullmq_adapter.js')
      return (runtime) => new BullMQAdapter(runtime, config)
    })
  },
}
