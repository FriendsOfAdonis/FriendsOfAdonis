import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'
import { type Database } from '@adonisjs/lucid/database'
import { type ApplicationService } from '@adonisjs/core/types'
import { GenericContainer, type StartedTestContainer } from 'testcontainers'

export const BASE_URL = new URL('../tmp/', import.meta.url)

/**
 * PostgreSQL test container configuration.
 */
export const POSTGRES_CONTAINER = new GenericContainer('postgres:16-alpine')
  .withExposedPorts(5432)
  .withEnvironment({
    POSTGRES_USER: 'test',
    POSTGRES_PASSWORD: 'test',
    POSTGRES_DB: 'test_db',
  })
  .withHealthCheck({
    test: ['CMD-SHELL', 'pg_isready -U test -d test_db'],
    interval: 1000,
    timeout: 3000,
    retries: 10,
    startPeriod: 2000,
  })
  .withStartupTimeout(60_000)

/**
 * Setup a minimal AdonisJS application with PostgreSQL database for testing.
 */
export async function setupPostgresApp(container: StartedTestContainer) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [() => import('@adonisjs/lucid/database_provider')],
      },
      config: {
        database: defineLucidConfig({
          connection: 'postgres',
          connections: {
            postgres: {
              client: 'pg',
              connection: {
                host: container.getHost(),
                port: container.getFirstMappedPort(),
                user: 'test',
                password: 'test',
                database: 'test_db',
              },
              searchPath: ['public'],
            },
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

  return { app }
}

/**
 * Get the Database instance from the application container.
 */
export async function getDatabase(app: ApplicationService): Promise<Database> {
  return app.container.make('lucid.db')
}

/**
 * Create a table in PostgreSQL using raw SQL.
 */
export async function createTable(db: Database, sql: string): Promise<void> {
  await db.rawQuery(sql)
}

/**
 * Drop a table from PostgreSQL.
 */
export async function dropTable(db: Database, tableName: string): Promise<void> {
  await db.rawQuery(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
}

/**
 * Clean up all tables in the public schema except system tables.
 */
export async function cleanupTables(db: Database): Promise<void> {
  const result = await db.rawQuery(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
  `)

  for (const row of result.rows) {
    await dropTable(db, row.tablename)
  }
}
