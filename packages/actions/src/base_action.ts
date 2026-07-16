import { RuntimeException } from '@adonisjs/core/exceptions'
import { type Logger } from '@adonisjs/core/logger'
import { type Constructor } from '@adonisjs/core/types/common'
import { type ActionExecutor } from './action_executor.ts'
import { type Entrypoints } from './types.ts'

/**
 * Base class for all actions in the application.
 * Actions are reusable units of business logic that can be executed
 * in different contexts (controllers, commands, event listeners).
 */
export class BaseAction {
  /**
   * @internal
   */
  $hydrated = false

  /**
   * The executor instance used to execute action handlers.
   * This is automatically set by the ActionsProvider during boot.
   */
  static executor?: ActionExecutor

  /**
   * Logger instance scoped to the action.
   * Automatically injected when the action is resolved.
   */
  declare logger: Logger

  constructor() {
    this.$wrapMethod('handle', this.handle)
  }

  /**
   * The main entry point for the action's business logic.
   * Must be implemented by all action classes.
   */
  handle(..._: any[]): any {
    throw new Error('Not implemented')
  }

  static get displayName() {
    return this.name
  }

  /**
   * Configures the runner instance for all actions extending this class.
   * Called automatically by the ActionsProvider during boot.
   */
  static useExecutor(executor: ActionExecutor) {
    this.executor = executor
  }

  /**
   * Wrap a method with the executor using Object.defineProperty.
   *
   * This allow hooking into method call without touching metadata
   * which would break libraries using decorators.
   *
   * @throws {RuntimeException} If no runner has been configured
   * @internal
   */
  $wrapMethod<Key extends keyof Entrypoints>(method: Key, original: Entrypoints[Key]) {
    const actionClass = this.constructor as typeof BaseAction

    if (!actionClass.executor) {
      throw new RuntimeException(
        `Cannot execute "${actionClass.name}.${method}" action handler. Make sure to pass executor to the "BaseAction" class for run to work`
      )
    }

    const executor = actionClass.executor

    Object.defineProperty(this, method, {
      configurable: true,
      value: (...args: any[]) => {
        return executor.execute(this, method, original, args as Parameters<Entrypoints[Key]>)
      },
    })
  }

  /**
   * Resolves the action using executor and run
   * the handle method.
   *
   * @throws {RuntimeException} If no runner has been configured
   */
  static async run<Action extends Constructor<BaseAction>>(
    this: Action,
    ...args: Parameters<InstanceType<Action>['handle']>
  ): Promise<ReturnType<InstanceType<Action>['handle']>> {
    const Action = this as unknown as typeof BaseAction

    if (!Action.executor) {
      throw new RuntimeException(
        `Cannot run "${this.name}" action. Make sure to pass runner to the "BaseAction" class for run to work`
      )
    }

    const action = await Action.executor.resolve(Action)

    return action.handle(...args)
  }
}
