import { ApplicationService } from '@adonisjs/core/types'
import { PowercordServer } from '../src/server.js'
import { HttpContext } from '@adonisjs/core/http'
import { Powercord } from '../src/powercord.js'

export default class PowercordProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton(PowercordServer, async (container) => {
      const logger = await container.make('logger')
      const transmit = await container.make('transmit')

      return new PowercordServer({
        transmit,
        logger,
        path: '/powercord',
      })
    })

    this.app.container.alias('powercord', PowercordServer)
  }

  async boot() {
    const powercord = await this.app.container.make('powercord')
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
    powercord: PowercordServer
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    powercord: Powercord | undefined
  }
}
