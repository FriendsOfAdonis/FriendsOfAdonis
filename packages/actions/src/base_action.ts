import { type ActionsRunner } from './runner.ts'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { type Logger } from '@adonisjs/core/logger'

export abstract class BaseAction {
  static runner?: ActionsRunner

  declare logger: Logger

  abstract handle(..._: any[]): any

  static useRunner(runner: ActionsRunner) {
    this.runner = runner
  }

  static async run<Action extends typeof BaseAction>(
    this: Action,
    ...args: Parameters<InstanceType<Action>['handle']>
  ) {
    if (!this.runner) {
      throw new RuntimeException(
        `Cannot run "${this.name}" action. Make sure to pass runner to the "BaseAction" class for run to work`
      )
    }

    return this.runner.dispatch(this, async (action) => {
      return action.handle(...args)
    })
  }
}
