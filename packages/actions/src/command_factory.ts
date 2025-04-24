import { BaseCommand } from '@adonisjs/core/ace'
import { AsCommand } from './base_action.js'
import { Constructor } from './types.js'
import { commandName } from './utils.js'

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
