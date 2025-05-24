import { ApplicationService } from '@adonisjs/core/types'
import { PowercordManager } from '../src/manager.js'
import { HttpContext } from '@adonisjs/core/http'
import { Powercord } from '../src/powercord.js'
import { configProvider } from '@adonisjs/core'
import { ResolvedConfig } from '../src/types.js'
import { RuntimeException } from '@poppinss/utils'

export default class PowercordProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton(PowercordManager, async () => {
      const transmitConfigProvider = this.app.config.get('powercord')

      const config = await configProvider.resolve<ResolvedConfig>(this.app, transmitConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/powercord.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new PowercordManager(config.transport())
    })

    this.app.container.alias('powercord', PowercordManager)
  }

  async boot() {
    const powercord = await this.app.container.make('powercord')

    await powercord.boot()

    HttpContext.getter('powercord', function (this: HttpContext) {
      const id = this.request.header('x-powercord-id')
      console.log(id)
      if (!id) return
      return powercord.clients.get(id)
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    powercord: PowercordManager
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    powercord: Powercord | undefined
  }
}
