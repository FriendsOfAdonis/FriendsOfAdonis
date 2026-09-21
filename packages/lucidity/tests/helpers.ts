import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ConnectionConfig } from '@adonisjs/lucid/types/database'
import { BaseModel } from '@adonisjs/lucid/orm'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function setupApp(params: Partial<any>) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge(params)
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
  return app
}

export async function setupDatabase(connection: ConnectionConfig) {
  const app = await setupApp({
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

  const db = await app.container.make('lucid.db')

  BaseModel.useAdapter(db.modelAdapter())

  return { app, db }
}
