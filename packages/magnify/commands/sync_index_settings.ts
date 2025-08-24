import 'reflect-metadata'
import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'
import { MagnifyEngine } from '../src/engines/main.js'

export default class SyncIndexSettings extends BaseCommand {
  static commandName = 'magnify:sync-index-settings'
  static description = 'Sync your configured index settings with your search engine (Meilisearch)'
  static options = { startApp: true }

  @inject()
  async run(): Promise<void> {
    const magnify = await this.app.container.make('magnify')
    const engine = magnify.engine() as MagnifyEngine

    if (!engine.syncIndexSettings) {
      throw new Error(`The driver "${String(engine)}" does not support updating index settings.`)
    }

    await engine.syncIndexSettings()
  }
}
