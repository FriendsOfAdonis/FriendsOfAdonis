import Hooks from '@poppinss/hooks'
import { type BaseAction } from './base_action.ts'
import { type Entrypoints } from './types.ts'
import { type ContainerResolver } from '@adonisjs/core/container'
import { type ContainerBindings } from '@adonisjs/core/types'
import type { HookHandlerProvider, HookHandler } from '@poppinss/hooks/types'

export type ActionDispatcherHooks = {
  execute: [[context: ActionExecutionContext], [result: unknown]]
}

// export type ActionExecutionContext<MethodName extends keyof Entrypoints = keyof Entrypoints> = {
//   action: BaseAction
//   method: MethodName
//   handler: Entrypoints[MethodName]
//   args: Parameters<Entrypoints[MethodName]>
// }

export type ActionExecutionContext = {
  [key in keyof Entrypoints]: {
    action: BaseAction
    method: key
    handler: Entrypoints[key]
    args: Parameters<Entrypoints[key]>
  }
}[keyof Entrypoints]

/**
 * The action dispatcher is in charge of
 * resolving action and executing handlers.
 *
 * @example
 * ```typescript
 * const action = await executor.resolve(MyAction)
 * await executor.execute(action, 'asListener', action.asListener, event)
 * ```
 */
export class ActionExecutor {
  #hooks = new Hooks<ActionDispatcherHooks>()
  #resolver: ContainerResolver<ContainerBindings>

  constructor(resolver: ContainerResolver<ContainerBindings>) {
    this.#resolver = resolver
  }

  /**
   * Executes an action method.
   *
   * The 'execute' hook is ran with cleanup to
   * hook into the execution process.
   *
   * @param action - The action instance
   * @param method - The method name executed
   * @param args - The args provided when calling the method
   *
   * @returns The result of the executed method
   */
  async execute<Method extends keyof Entrypoints>(
    action: BaseAction,
    method: Method,
    handler: Entrypoints[Method],
    args: Parameters<Entrypoints[Method]>
  ) {
    const runner = this.#hooks.runner('execute')

    await this.hydrate(action)

    // @ts-expect-error
    await runner.run({ action, method, handler, args })

    // @ts-expect-error
    const result = await handler.call(action, ...args)

    await runner.cleanup(result)

    return result
  }

  /**
   * Hydrates the executed action.
   */
  async hydrate(action: BaseAction) {
    if (action.$hydrated) return
    const logger = await this.#resolver.make('logger')
    action.logger = logger.child({ action: action.constructor.name })
    action.$hydrated = true
  }

  /**
   * Create an action instance by resolving from the container.
   *
   * @param actionClass - The action constructor
   *
   * @returns The action instance
   */
  async resolve<Action extends typeof BaseAction>(actionClass: Action) {
    const action = await this.#resolver.make(actionClass)
    return action
  }

  hook<Event extends keyof ActionDispatcherHooks>(
    event: Event,
    handler:
      | HookHandler<ActionDispatcherHooks[Event][0], ActionDispatcherHooks[Event][1]>
      | HookHandlerProvider<ActionDispatcherHooks[Event][0], ActionDispatcherHooks[Event][1]>
  ) {
    console.log('adding hook', handler)
    this.#hooks.add(event, handler)
  }
}
