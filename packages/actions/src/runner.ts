import { type ContainerResolver } from '@adonisjs/core/container'
import { type BaseAction } from './base_action.ts'
import { type ContainerBindings } from '@adonisjs/core/types'

/**
 * Type definition for ActionsRunner hooks.
 * Used for instrumenting action execution with OpenTelemetry.
 */
export type ActionsRunnerHooks = {
  run: [[action: BaseAction], [result: unknown]]
}

/**
 * The core runner responsible for resolving and executing actions
 * with dependency injection support.
 */
export class ActionsRunner {
  #defaultResolver: ContainerResolver<ContainerBindings>

  /**
   * @param resolver - The container resolver used for dependency injection
   */
  constructor(resolver: ContainerResolver<ContainerBindings>) {
    this.#defaultResolver = resolver
  }

  /**
   * Dispatches an action by resolving it from the container and
   * executing the provided runner function.
   */
  async dispatch<Action extends typeof BaseAction>(
    actionClass: Action,
    runner: (action: InstanceType<Action>) => Promise<any>,
    container?: ContainerResolver<ContainerBindings>
  ): Promise<ReturnType<InstanceType<Action>['handle']>> {
    const action = await this.resolve(actionClass, container)
    return runner(action)
  }

  /**
   * Resolves an action class from the container with dependencies injected.
   * Also injects a scoped logger instance.
   */
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
