import { type ApplicationService } from '@adonisjs/core/types'
import { Flick } from '../src/flick.ts'
import { FlickOptions, FlickService } from '../src/types.ts'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class FlickProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('flick', async (resolver) => {
      const flickConfigProvider = this.app.config.get('flick', {})
      const config = await configProvider.resolve<FlickOptions>(this.app, flickConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/flick.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Flick<any>(config.features, resolver, config.driver)
    })
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    flick: FlickService
  }
}
