import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'
import { type Database } from '@adonisjs/lucid/database'
import { type ApplicationService } from '@adonisjs/core/types'
import { type FileSystem } from '@japa/file-system'

export const BASE_URL = new URL('../tmp/', import.meta.url)

/**
 * Setup a fake AdonisJS project structure required by the framework.
 */
export async function setupFakeAdonisProject(fs: FileSystem) {
  await Promise.all([
    fs.create('.env', ''),
    fs.createJson('tsconfig.json', {}),
    fs.create('adonisrc.ts', 'export default defineConfig({})'),
    fs.create(
      'start/env.ts',
      `
    import { Env } from '@adonisjs/core/env'

    export default await Env.create(new URL('../', import.meta.url), {})
`
    ),
  ])
}

/**
 * Setup a minimal AdonisJS application with SQLite database for testing.
 */
export async function setupApp(config: Record<string, any> = {}) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [() => import('@adonisjs/lucid/database_provider')],
      },
      config: {
        database: defineLucidConfig({
          connection: 'sqlite',
          connections: {
            sqlite: {
              client: 'better-sqlite3',
              connection: {
                filename: ':memory:',
              },
              useNullAsDefault: true,
            },
          },
        }),
        ...config,
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
 * Create a table in the database using raw SQL.
 */
export async function createTable(db: Database, sql: string): Promise<void> {
  await db.rawQuery(sql)
}

/**
 * Drop a table from the database.
 */
export async function dropTable(db: Database, tableName: string): Promise<void> {
  await db.rawQuery(`DROP TABLE IF EXISTS \`${tableName}\``)
}

/**
 * Create multiple tables in the database.
 */
export async function createTables(db: Database, sqls: string[]): Promise<void> {
  for (const sql of sqls) {
    await db.rawQuery(sql)
  }
}

/**
 * Clean up all tables except SQLite system tables.
 */
export async function cleanupTables(db: Database): Promise<void> {
  const connection = db.connection()
  const tables = await connection.getAllTables()

  for (const table of tables) {
    await dropTable(db, table)
  }
}

/**
 * Helper to create common table definitions for testing.
 */
export const TableDefinitions = {
  /**
   * Simple users table with common column types.
   */
  users: `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(100),
      password TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME,
      updated_at DATETIME
    )
  `,

  /**
   * Posts table with foreign key.
   */
  posts: `
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT,
      published INTEGER DEFAULT 0,
      created_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `,

  /**
   * Table with composite index.
   */
  tagsWithCompositeIndex: `
    CREATE TABLE tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(50) NOT NULL
    );
    CREATE UNIQUE INDEX idx_tags_name_slug ON tags(name, slug);
  `,

  /**
   * Table with multiple indices.
   */
  productsWithIndices: `
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku VARCHAR(50) NOT NULL,
      name VARCHAR(200) NOT NULL,
      price INTEGER NOT NULL,
      category VARCHAR(100)
    );
    CREATE UNIQUE INDEX idx_products_sku ON products(sku);
    CREATE INDEX idx_products_category ON products(category);
    CREATE INDEX idx_products_price_category ON products(price, category);
  `,

  /**
   * Table with all nullable columns.
   */
  optionalData: `
    CREATE TABLE optional_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field1 VARCHAR(100),
      field2 TEXT,
      field3 INTEGER
    )
  `,

  /**
   * Table with default values.
   */
  withDefaults: `
    CREATE TABLE with_defaults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status VARCHAR(20) DEFAULT 'pending',
      count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      metadata TEXT DEFAULT '{}'
    )
  `,

  /**
   * Simple table with no indices.
   */
  simple: `
    CREATE TABLE simple (
      id INTEGER PRIMARY KEY,
      value TEXT
    )
  `,
}
