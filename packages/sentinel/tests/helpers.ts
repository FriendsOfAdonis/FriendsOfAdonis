import { configProvider } from '@adonisjs/core'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig as defineHashConfig, drivers, HashManager } from '@adonisjs/core/hash'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import type { ManagerDriverFactory } from '@adonisjs/core/types/hash'
import { defineConfig as defineDatabaseConfig } from '@adonisjs/lucid'
import type { Database } from '@adonisjs/lucid/database'
import type { SqliteConfig } from '@adonisjs/lucid/types/database'
import { DEFAULT_TOKENS_TABLE_NAME } from '../modules/token/constants.ts'
import { defineConfig } from '../src/define_config.ts'
import type { SentinelConfig } from '../src/types.ts'
import { TokenSchema } from '../modules/token/schema.ts'
import { TOTPSchema } from '../modules/totp/schema.ts'
import { FakeMemoryTokenProvider } from '../modules/token/providers/fake.ts'

export const BASE_URL = new URL('./tmp/', import.meta.url)

type CreateAppOptions = {
  /**
   * Application config merged on top of the core config.
   */
  config?: Record<string, unknown>
  /**
   * Providers registered in addition to the core providers.
   */
  providers?: Array<() => Promise<{ default: unknown }>>
}

/**
 * Boots a minimal console application rooted at "tests/tmp".
 */
export async function createApp(options: CreateAppOptions = {}) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      config: options.config ?? {},
      rcFileContents: { providers: options.providers ?? [] },
    })
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

  return app
}

/**
 * Hash manager backed by the given drivers. Defaults to a single
 * "scrypt" driver, like the core configuration.
 */
export function createHashManager(
  list: Record<string, ManagerDriverFactory> = { scrypt: () => new Scrypt({}) }
) {
  const hash = new HashManager({ default: Object.keys(list)[0], list })

  /**
   * The package types the hash service the way the container does
   * in an application without a "HashersList" augmentation.
   */
  return hash as unknown as HashManager<never>
}

/**
 * Lucid configuration with two in-memory SQLite connections,
 * "sqlite" (the default) and "secondary". Each connection is
 * its own database.
 */
export function databaseConfig() {
  const sqlite = (): SqliteConfig => ({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })

  return defineDatabaseConfig({
    connection: 'sqlite',
    connections: { sqlite: sqlite(), secondary: sqlite() },
  })
}

/**
 * Boots an application with the Lucid provider and returns its database.
 */
export async function createDatabase() {
  const app = await createApp({
    providers: [() => import('@adonisjs/lucid/database_provider')],
    config: { database: databaseConfig() },
  })

  const db = await app.container.make('lucid.db')

  return { app, db }
}

/**
 * Creates the table read and written by the Lucid token provider.
 */
export async function createTokensTable(
  db: Database,
  table: string = DEFAULT_TOKENS_TABLE_NAME,
  connection?: string
) {
  await db.connection(connection).schema.createTable(table, TokenSchema.configureTokensTable)
}

/**
 * Creates the table read and written by the TOTP authenticators.
 */
export async function createAuthenticatorsTable(db: Database, connection?: string) {
  await db
    .connection(connection)
    .schema.createTable('totp_authenticators', TOTPSchema.configureAuthenticatorsTable)
}

/**
 * Building blocks configured by "createSentinelApp".
 */
export const SENTINEL_CONFIG = {
  magicLink: { url: 'https://example.com/auth/magic-link', expiresIn: '20m' },
  otp: { length: 6, expiresIn: '20m', maximumFailedAttempts: 5 },
  totp: { issuer: '@foadonis/totp' },
  password: { expiresIn: '1h' },
} satisfies Omit<SentinelConfig, 'tokens'>

/**
 * Token provider of the sentinel service booted by "createSentinelApp".
 */
const sentinelTokens = new FakeMemoryTokenProvider()

/**
 * Hash configuration of the application booted by "createSentinelApp".
 * The "weak" hasher produces hashes the default one considers outdated,
 * which is how the rehash of "verifyCredentials" is exercised.
 */
export const HASH_CONFIG = defineHashConfig({
  default: 'scrypt',
  list: { scrypt: drivers.scrypt({}), weak: drivers.scrypt({ cost: 2048 }) },
})

/**
 * Boots an application with the Lucid and Sentinel providers, a "users"
 * table and every building block configured. Tokens are kept in memory
 * inside the returned provider.
 *
 * "services/main.ts" binds the sentinel service once, to the application
 * booted when it is first imported. Specs relying on the model mixins
 * must import them after calling this function, and they all share the
 * same configuration and token provider so that the service bound by
 * the first spec fits the others.
 */
export async function createSentinelApp() {
  const app = await createApp({
    providers: [
      () => import('@adonisjs/lucid/database_provider'),
      () => import('../providers/sentinel_provider.ts'),
    ],
    config: {
      database: databaseConfig(),
      hash: HASH_CONFIG,
      sentinel: defineConfig({
        tokens: configProvider.create(async () => sentinelTokens),
        ...SENTINEL_CONFIG,
      }),
    },
  })

  const db = await app.container.make('lucid.db')
  await db.connection().schema.createTable('users', (table) => {
    table.increments('id')
    table.string('email').notNullable()
    table.string('username').nullable()
    table.string('password').nullable()
  })

  return { app, db, provider: sentinelTokens }
}
