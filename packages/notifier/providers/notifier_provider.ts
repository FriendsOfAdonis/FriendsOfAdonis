import { ApplicationService } from '@adonisjs/core/types'
import { Notifier } from '../src/notifier.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { NotifierEvents } from '@foadonis/notifier/types'

export default class NotifierProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Notifier, async (container) => {
      const notifierConfigProvider = this.app.config.get('notifier')
      const config = await configProvider.resolve<any>(this.app, notifierConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/notifier.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      const emitter = await container.make('emitter')

      return new Notifier(emitter, config)
    })
  }
}

declare module '@adonisjs/core/types' {
  export interface EventsList extends NotifierEvents {}
}
