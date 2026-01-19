import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ConnectionConfig } from '@adonisjs/lucid/types/database'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function setupDatabase(connection: ConnectionConfig) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [() => import('@adonisjs/lucid/database_provider')],
      },
      config: {
        database: defineLucidConfig({
          connection: 'default',
          connections: {
            default: connection,
          },
        }),
      },
    })
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const db = await app.container.make('lucid.db')

  return { app, db }
}
