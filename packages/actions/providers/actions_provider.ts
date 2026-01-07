import { type ApplicationService } from '@adonisjs/core/types'
import { ActionsManager } from '../src/manager.js'

export default class ActionsProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton('actions', () => {
      return new ActionsManager()
    })
  }

  async boot() {}
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    actions: ActionsManager
  }
}
