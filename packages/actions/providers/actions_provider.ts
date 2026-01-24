import { type ApplicationService } from '@adonisjs/core/types'
import { ActionsRunner } from '../src/runner.ts'
import { BaseAction } from '../src/base_action.ts'
import { ActionLoader } from '../src/loader.ts'

export default class ActionsProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton(ActionsRunner, (resolver) => {
      return new ActionsRunner(resolver)
    })

    this.app.container.alias('actions.runner', ActionsRunner)
  }

  async boot() {
    const runner = await this.app.container.make('actions.runner')
    BaseAction.useRunner(runner)
    ActionLoader.useRunner(runner)
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'actions.runner': ActionsRunner
  }
}
