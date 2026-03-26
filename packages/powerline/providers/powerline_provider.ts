import { type ApplicationService } from '@adonisjs/core/types'
import { Powerline } from '../src/powerline_server.ts'
import { type PowerlineConfig } from '../src/types.ts'

export default class PowerlineProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Powerline, async (resolver) => {
      const httpServer = await resolver.make('server')
      const logger = await resolver.make('logger')
      const config = this.app.config.get<PowerlineConfig>('powerline', {})
      return new Powerline(httpServer, this.app.container, logger, config)
    })

    this.app.container.alias('powerline', Powerline)
  }

  async ready() {
    if (this.app.getEnvironment() === 'web') {
      const powerline = await this.app.container.make('powerline')
      await powerline.start()
    }
  }

  async shutdown() {
    const powerline = await this.app.container.make('powerline')
    await powerline.stop()
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    powerline: Powerline
  }
}
