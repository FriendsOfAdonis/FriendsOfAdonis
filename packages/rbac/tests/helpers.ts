import { AppFactory } from '@adonisjs/core/factories/app'
import { EmitterFactory } from '@adonisjs/core/factories/events'
import { LoggerFactory } from '@adonisjs/core/factories/logger'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { Database } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'

/**
 * Root of the temporary application used by the tests. Cleaned by the
 * Japa file system plugin.
 */
export const BASE_URL = new URL('./tmp/', import.meta.url)

/**
 * A query reported through the "db:query" event.
 */
export interface ReportedQuery {
  /**
   * The executed SQL statement.
   */
  sql: string

  /**
   * The bindings of the statement.
   */
  bindings?: unknown[]
}

/**
 * Creates the tables used by the model fixtures.
 */
async function createSchema(db: Database) {
  /**
   * Knex schema builders accumulate statements, so each table gets a
   * fresh builder.
   */
  const schema = () => db.connection().schema
  await schema().createTable('users', (table) => {
    table.increments('id')
    table.string('email').notNullable()
    table.json('permissions').notNullable()
  })
  await schema().createTable('roles', (table) => {
    table.increments('id')
    table.string('name').notNullable().unique()
    table.json('permissions').notNullable()
  })
  await schema().createTable('user_roles', (table) => {
    table.increments('id')
    table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
    table.integer('role_id').unsigned().notNullable().references('roles.id').onDelete('CASCADE')
    table.unique(['user_id', 'role_id'])
  })
  await schema().createTable('members', (table) => {
    table.increments('id')
    table.json('permissions').notNullable()
  })
  await schema().createTable('member_roles', (table) => {
    table.increments('id')
    table.integer('member_id').unsigned().notNullable().references('members.id')
    table.integer('role_id').unsigned().notNullable().references('roles.id')
    table.unique(['member_id', 'role_id'])
  })
  await schema().createTable('team_members', (table) => {
    table.increments('id')
    table.integer('team_id').notNullable()
    table.integer('user_id').notNullable()
  })
  await schema().createTable('team_member_roles', (table) => {
    table.increments('id')
    table.integer('membership_id').unsigned().notNullable().references('team_members.id')
    table.integer('granted_role_id').unsigned().notNullable().references('roles.id')
    table.unique(['membership_id', 'granted_role_id'])
  })
}

/**
 * Creates an in-memory sqlite database with the fixtures schema, binds
 * it to every Lucid model and records the executed queries.
 */
export async function setupDatabase() {
  const app = new AppFactory().create(BASE_URL)
  const emitter = new EmitterFactory().create(app)
  const logger = new LoggerFactory().create()

  const db = new Database(
    {
      connection: 'sqlite',
      connections: {
        sqlite: {
          client: 'better-sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
          debug: true,
          pool: { min: 1, max: 1 },
        },
      },
    },
    logger,
    emitter
  )

  BaseModel.$adapter = db.modelAdapter()

  /**
   * Close the connection when the schema cannot be created, otherwise
   * the open handle keeps the test runner alive.
   */
  try {
    await createSchema(db)
  } catch (error) {
    await db.manager.closeAll()
    throw error
  }

  const queries: ReportedQuery[] = []
  emitter.on('db:query', (query: ReportedQuery) => {
    queries.push(query)
  })

  return {
    db,
    queries,

    /**
     * Runs the callback and returns the queries it executed.
     */
    async track<T>(callback: () => Promise<T>): Promise<{ result: T; queries: ReportedQuery[] }> {
      const start = queries.length
      const result = await callback()
      return { result, queries: queries.slice(start) }
    },

    /**
     * Closes the connection.
     */
    async close() {
      await db.manager.closeAll()
    },
  }
}

/**
 * Boots a console application rooted at BASE_URL, used by the configure tests.
 */
export async function createApplication() {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('console')
  await app.init()
  await app.boot()

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  return { ace, app }
}
