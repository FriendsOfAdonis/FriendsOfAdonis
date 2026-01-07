import { args, BaseCommand } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MakeResolverCommand extends BaseCommand {
  static commandName = 'make:resolver'
  static description = 'Create a new GraphQL resolver class'

  @args.string({
    description: 'The name of the resolver',
  })
  declare name: string

  async run(): Promise<any> {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'make/resolver.stub', {
      name: this.name,
    })
  }
}
