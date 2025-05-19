import { ApplicationService } from '@adonisjs/core/types'
import { CockpitManager } from '../src/cockpit_manager.js'
import { CockpitConfig, ResolvedConfig } from '../src/types.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class CockpitProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton(CockpitManager, async (container) => {
      const router = await container.make('router')
      const cockpitConfigProvider = this.app.config.get<CockpitConfig>('cockpit')
      const config = await configProvider.resolve<ResolvedConfig>(this.app, cockpitConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/cockpit.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new CockpitManager(config, router)
    })
  }

  async boot() {
    const cockpit = await this.app.container.make(CockpitManager)

    await cockpit.boot()
  }
}
