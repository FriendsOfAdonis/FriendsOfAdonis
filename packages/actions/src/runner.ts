import { type ContainerResolver } from '@adonisjs/core/container'
import { type BaseAction } from './base_action.ts'
import { type ContainerBindings } from '@adonisjs/core/types'

export type ActionsRunnerHooks = {
  run: [[action: BaseAction], [result: unknown]]
}

export class ActionsRunner {
  #defaultResolver: ContainerResolver<ContainerBindings>

  constructor(resolver: ContainerResolver<ContainerBindings>) {
    this.#defaultResolver = resolver
  }

  async dispatch<Action extends typeof BaseAction>(
    actionClass: Action,
    runner: (action: InstanceType<Action>) => Promise<any>,
    container?: ContainerResolver<ContainerBindings>
  ): Promise<ReturnType<InstanceType<Action>['handle']>> {
    const action = await this.resolve(actionClass, container)
    return runner(action)
  }

  async resolve<T extends typeof BaseAction>(
    Action: T,
    resolver: ContainerResolver<ContainerBindings> = this.#defaultResolver
  ) {
    const action = await resolver.make(Action)
    const logger = await resolver.make('logger')
    action.logger = logger.child({ action: Action.name })
    return action
  }
}
