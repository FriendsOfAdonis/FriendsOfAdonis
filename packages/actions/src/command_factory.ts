import { BaseCommand } from '@adonisjs/core/ace'
import { commandName } from './utils.js'
import { type Constructor } from '@adonisjs/core/types/common'
import { type AsCommand } from './types.ts'

/**
 * Creates an Ace command class from an action implementing AsCommand.
 * The command name defaults to "action:{action-name}" unless a custom
 * `commandName` static property is defined.
 */
export function makeCommand(Action: Constructor<AsCommand>): typeof BaseCommand {
  class FakeCommand extends BaseCommand {
    async exec(): Promise<any> {
      const action = await this.app.container.make(Action)
      return action.asCommand(this)
    }
  }

  FakeCommand.commandName =
    'commandName' in Action && typeof Action.commandName === 'string'
      ? Action.commandName
      : commandName(Action.name)

  FakeCommand.description =
    'description' in Action && typeof Action.description === 'string'
      ? Action.description
      : `Run the action ${Action.name}`

  return FakeCommand
}
