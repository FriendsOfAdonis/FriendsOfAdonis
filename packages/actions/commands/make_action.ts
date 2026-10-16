import { args, BaseCommand } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MakeActionCommand extends BaseCommand {
  static commandName = 'make:action'
  static description = 'Create a new Action class'

  @args.string({
    description: 'The name of the action',
  })
  declare name: string

  async run(): Promise<any> {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'make/action.stub', {
      name: this.name,
    })
  }
}
