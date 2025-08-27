import 'reflect-metadata'
import { args, BaseCommand } from '@adonisjs/core/ace'
import { SearchableModel } from '../src/types.js'

export default class Flush extends BaseCommand {
  static commandName = 'magnify:flush'
  static description = "Flush all of the model's records from the index"
  static options = { startApp: true }

  @args.string({ required: true })
  declare modelPath: string

  async run(): Promise<any> {
    const model: SearchableModel = await this.importModel(this.modelPath)
    if (!model) {
      this.logger.error(`Cannot import model from name or path "${this.modelPath}"`)
      this.exitCode = 1
      return
    }

    await model.$removeAllFromSearch()
    this.logger.success(`The index [${model.$searchIndex}] has been successfully flushed`)
  }

  async importModel(model: string) {
    let Model = await import(`#models/${model}`).then((d) => d.default).catch(() => null)
    if (!Model) {
      const url = new URL(model, this.app.appRoot)
      Model = await import(url.pathname).then((d) => d.default).catch(() => null)
    }

    return Model
  }
}
