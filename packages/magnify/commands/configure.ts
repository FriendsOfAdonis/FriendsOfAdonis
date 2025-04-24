import { args, BaseCommand } from '@adonisjs/core/ace'
import { Codemods } from '@adonisjs/core/ace/codemods'
import stringHelpers from '@adonisjs/core/helpers/string'
import {
  configureEnvValidations,
  configureEnvVariables,
  ENGINE_CONFIGURATIONS,
  EngineConfiguration,
  installDependencies,
} from '../configure.js'

export default class ConfigureCommand extends BaseCommand {
  static commandName = 'magnify:configure'
  static description = 'Configure a Search Engine'

  @args.string({ required: false })
  declare engine?: string

  async getEngineName(): Promise<string> {
    if (this.engine) return stringHelpers.pascalCase(this.engine)

    return this.prompt.choice(
      'What Search Engine do you want to configure?',
      ENGINE_CONFIGURATIONS.map((engine) => ({
        name: engine.id,
        message: engine.name,
        hint: engine.description,
      })),
      {
        name: 'engine',
      }
    )
  }

  async getEngineConfiguration(): Promise<EngineConfiguration> {
    const name = await this.getEngineName()
    const configuration = ENGINE_CONFIGURATIONS.find((e) => e.name === name)
    if (!configuration) throw new Error(`Engine ${name} not found`)
    return configuration
  }

  async run(): Promise<any> {
    const configuration = await this.getEngineConfiguration()
    const codemods = await this.createCodemods()

    await configureEnvValidations(codemods, configuration)
    await configureEnvVariables(this, codemods, configuration)
    await installDependencies(this, codemods, configuration)
  }
}
