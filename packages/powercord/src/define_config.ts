import { ConfigProvider } from '@adonisjs/core/types'
import { PowercordConfig, ResolvedConfig } from './types.js'
import { configProvider } from '@adonisjs/core'
import { TransmitTransport, TransmitTransportOptions } from './transports/transmit_transport.js'

export function defineConfig(config: PowercordConfig): ConfigProvider<ResolvedConfig> {
  return configProvider.create(async (app) => {
    return {
      transport: await config.transport.resolver(app),
    }
  })
}

export const transports: {
  transmit: (config: TransmitTransportOptions) => ConfigProvider<() => TransmitTransport>
} = {
  transmit(config) {
    return {
      type: 'provider',
      async resolver(app) {
        const transmit = await app.container.make('transmit')

        return () => new TransmitTransport(transmit, config)
      },
    }
  },
}
