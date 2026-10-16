import { type ActionsRunner } from './runner.ts'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { type Logger } from '@adonisjs/core/logger'
import { type Constructor } from '@adonisjs/core/types/common'

/**
 * Base class for all actions in the application.
 * Actions are reusable units of business logic that can be executed
 * in different contexts (controllers, commands, event listeners).
 */
export abstract class BaseAction {
  /**
   * The runner instance used to execute actions.
   * This is automatically set by the ActionsProvider during boot.
   */
  static runner?: ActionsRunner

  /**
   * Logger instance scoped to the action.
   * Automatically injected when the action is resolved.
   */
  declare logger: Logger

  /**
   * The main entry point for the action's business logic.
   * Must be implemented by all action classes.
   */
  abstract handle(..._: any[]): any

  /**
   * Configures the runner instance for all actions extending this class.
   * Called automatically by the ActionsProvider during boot.
   */
  static useRunner(runner: ActionsRunner) {
    this.runner = runner
  }

  /**
   * Executes the action's handle method with dependency injection.
   * @throws {RuntimeException} If no runner has been configured
   */
  static run<Action extends Constructor<BaseAction>>(
    this: Action,
    ...args: Parameters<InstanceType<Action>['handle']>
  ): ReturnType<InstanceType<Action>['handle']> {
    const Action = this as unknown as typeof BaseAction

    if (!Action.runner) {
      throw new RuntimeException(
        `Cannot run "${this.name}" action. Make sure to pass runner to the "BaseAction" class for run to work`
      )
    }

    return Action.runner.dispatch(Action, async (action) => {
      return action.handle(...args)
    }) as ReturnType<InstanceType<Action>['handle']>
  }
}
