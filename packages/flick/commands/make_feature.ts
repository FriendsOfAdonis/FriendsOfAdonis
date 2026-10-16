import { args, BaseCommand } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MakeFeatureCommand extends BaseCommand {
  static commandName = 'make:feature'
  static description = 'Create a new feature flag class'

  @args.string({
    description: 'The name of the feature',
  })
  declare name: string

  async run(): Promise<any> {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'make/feature.stub', {
      name: this.name,
    })
  }
}
