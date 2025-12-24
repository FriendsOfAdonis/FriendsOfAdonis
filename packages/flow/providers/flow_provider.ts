import { ApplicationService } from '@adonisjs/core/types'
import { FlowService } from '../src/types.js'
import { Flow } from '../src/flow.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    flow: FlowService
  }
}

export default class FlowProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Flow, async (resolver) => {
      const flowConfigProvider = this.app.config.get('flow', {})
      const config = await configProvider.resolve<any>(this.app, flowConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/flow.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Flow(resolver, config)
    })

    this.app.container.alias('flow', Flow)
  }

  async boot() {
    const flow = await this.app.container.make('flow')
    await flow.boot()
  }
}
