import { type BaseCommand } from '@adonisjs/core/ace'
import { type HttpContext } from '@adonisjs/core/http'
import { type ActionsRunner } from './manager.ts'
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

export interface AsController {
  asController(context: HttpContext): any
}

export interface AsCommand {
  commandName?: string
  description?: string

  asCommand(command: BaseCommand): any
}

export interface AsListener<T = unknown> {
  asListener(event: T): any
}
