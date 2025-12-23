import { ApplicationService } from '@adonisjs/core/types'
import { FlowService } from '../src/types.js'
import { Flow } from '../src/flow.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    flow: FlowService
  }
}

export default class FlowProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(Flow, async (resolver) => {
      const config = this.app.config.get('flow', {})
      const logger = await this.app.container.make('logger')
      return new Flow(resolver)
    })

    this.app.container.alias('flow', Flow)
  }
}
