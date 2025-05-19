import { ConfigProvider } from '@adonisjs/core/types'
import { CockpitConfig, ResolvedConfig } from './types.js'
import { configProvider } from '@adonisjs/core'
import is from '@adonisjs/core/helpers/is'

export function defineConfig(config: CockpitConfig): ConfigProvider<ResolvedConfig> {
  return configProvider.create(async (app) => {
    return {
      menu: config.menu,
      resources: {
        autoload: config.resources.autoload
          ? is.string(config.resources.autoload)
            ? config.resources.autoload
            : app.makePath('app/cockpit/resources')
          : false,
      },
    }
  })
}
