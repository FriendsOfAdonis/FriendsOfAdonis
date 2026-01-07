import { type ApplicationService } from '@adonisjs/core/types'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class SchedulerProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('magnify', async () => {
      const magnifyConfigProvider = this.app.config.get('magnify')

      const config = await configProvider.resolve<any>(this.app, magnifyConfigProvider)
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/magnify.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      const { MagnifyManager } = await import('../src/magnify_manager.js')
      return new MagnifyManager(config)
    })
  }
}
