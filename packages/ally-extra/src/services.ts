import { ConfigProvider } from '@adonisjs/core/types'
import type { OIDCDriver, OIDCDriverConfig } from './drivers/oidc.js'
import { HttpContext } from '@adonisjs/core/http'
import { configProvider } from '@adonisjs/core'

export const services: {
  oidc: (config: OIDCDriverConfig) => ConfigProvider<(ctx: HttpContext) => OIDCDriver>
} = {
  oidc(config) {
    return configProvider.create(async () => {
      const { OIDCDriver } = await import('./drivers/oidc.js')
      return (ctx) => new OIDCDriver(ctx, config)
    })
  },
}
