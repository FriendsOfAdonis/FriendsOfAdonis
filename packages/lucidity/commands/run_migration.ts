import { type CommandOptions } from '@adonisjs/core/types/ace'
import Migrate from '@adonisjs/lucid/commands/migration/run'

export default class RunMigrationCommand extends Migrate {
  static commandName = 'migration:run'
  static description = 'Create a new GraphQL resolver class'

  static options: CommandOptions = {
    startApp: true,
  }

  async run(): Promise<any> {
    return super.run()
  }
}
