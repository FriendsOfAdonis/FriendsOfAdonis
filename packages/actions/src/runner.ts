import { type ContainerResolver } from '@adonisjs/core/container'
import { type BaseAction } from './base_action.ts'
import { type ContainerBindings } from '@adonisjs/core/types'
import Hooks from '@poppinss/hooks'

/**
 * Type definition for ActionsRunner hooks.
 * Used for instrumenting action execution with OpenTelemetry.
 */
export type ActionsRunnerHooks = {
  execute: [[action: BaseAction], [result: unknown]]
}

/**
 * The core runner responsible for resolving and executing actions
 * with dependency injection support.
 */
export class ActionsRunner {
  #resolver: ContainerResolver<ContainerBindings>

  #hooks: Hooks<ActionsRunnerHooks>

  /**
   * @param resolver - The container resolver used for dependency injection
   */
  constructor(resolver: ContainerResolver<ContainerBindings>) {
    this.#resolver = resolver
    this.#hooks = new Hooks()
  }

  /**
   * This method re-define a property to wrap the original method with configured middlewares.
   *
   * This is allow hooking into actions execution lifecycle without
   * touching the actual property which would break its metadata.
   */
  async wrap<
    Action extends BaseAction,
    Property extends keyof Action & string,
    Method extends (...args: any[]) => any,
  >(action: Action, property: Property, original: Method) {
    const actionClass = action.constructor as typeof BaseAction
    const logger = await this.#resolver.make('logger')

    action.logger = logger.child({ action: actionClass.displayName })

    Object.defineProperty(action, property, {
      configurable: true,
      enumerable: false,
      value: async (...args: Parameters<Method>) => {
        const runner = this.#hooks.runner('execute')

        await runner.run(action)
        const output = await original.apply(action, args)
        await runner.cleanup(output)

        return output
      },
    })
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
    resolver: ContainerResolver<ContainerBindings> = this.#resolver
  ) {
    const action = await resolver.make(Action)
    const logger = await resolver.make('logger')
    action.logger = logger.child({ action: Action.name })
    return action
  }
}
