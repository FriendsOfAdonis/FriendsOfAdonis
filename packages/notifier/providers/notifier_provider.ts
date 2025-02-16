import { ApplicationService } from '@adonisjs/core/types'
import { Notifier } from '../src/notifier.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class NotifierProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Notifier, async () => {
      const notifierConfigProvider = this.app.config.get('notifier')
      const config = await configProvider.resolve<any>(this.app, notifierConfigProvider)
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/notifier.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Notifier(config)
    })
  }
}
