import { IgnitorFactory } from '@adonisjs/core/factories'
import appConfig from './app_config.js'
import { Shopkeeper } from '../src/shopkeeper.js'
import { type ApplicationService } from '@adonisjs/core/types'
import { type Kernel } from '@adonisjs/core/ace'

export const BASE_URL = new URL('./tmp/', import.meta.url)

let app: ApplicationService
let shopkeeper: Shopkeeper
let ace: Kernel
export async function createApp() {
  if (app) {
    return { app, shopkeeper, ace }
  }

  const ignitor = new IgnitorFactory()
    .merge(appConfig)
    .withCoreConfig()
    .withCoreProviders()
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  app = ignitor.createApp('web')

  await app.init()
  await app.boot()

  ace = await app.container.make('ace')
  shopkeeper = await app.container.make(Shopkeeper)

  return { app, ace, shopkeeper }
}
