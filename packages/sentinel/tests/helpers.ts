import { join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import timekeeper from 'timekeeper'
import { getActiveTestOrFail } from '@japa/runner'
import { AppFactory } from '@adonisjs/core/factories/app'
import { LoggerFactory } from '@adonisjs/core/factories/logger'
import { EmitterFactory } from '@adonisjs/core/factories/events'
import { EncryptionFactory } from '@adonisjs/core/factories/encryption'
import { ChaCha20Poly1305 } from '@adonisjs/core/encryption/drivers/chacha20_poly1305'
import { Database } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'
import { TokenSchema } from '../modules/token/schema.ts'
import { TOTPSchema } from '../modules/totp/schema.ts'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function createDatabase() {
  const test = getActiveTestOrFail()
  const fs = test.context.fs

  await mkdir(fs.basePath, { recursive: true })

  const app = new AppFactory().create(fs.baseUrl, () => {})
  const logger = new LoggerFactory().create()
  const emitter = new EmitterFactory().create(app)
  const db = new Database(
    {
      connection: 'sqlite',
      connections: {
        sqlite: {
          client: 'better-sqlite3',
          connection: { filename: join(fs.basePath, 'db.sqlite') },
          useNullAsDefault: true,
        },
      },
    },
    logger,
    emitter
  )

  test.cleanup(() => db.manager.closeAll())
  BaseModel.$adapter = db.modelAdapter()

  return db
}

export async function createTables(db: Database) {
  const schema = db.connection().schema

  await schema.dropTableIfExists('users')
  await schema.dropTableIfExists('sentinel_tokens')
  await schema.dropTableIfExists('totp_authenticators')

  await schema.createTable('users', (table) => {
    table.increments()
    table.string('email').nullable()
    table.string('unverified_email').nullable()
    table.timestamp('email_verified_at').nullable()
    table.string('username').nullable()
  })

  await schema.createTable('sentinel_tokens', (table) => {
    TokenSchema.configureTokensTable(table)
  })

  await schema.createTable('totp_authenticators', (table) => {
    TOTPSchema.configureAuthenticatorsTable(table)
  })
}

export function createForeignEncryption() {
  return new EncryptionFactory({
    driver: (key) => new ChaCha20Poly1305({ id: 'foreign', key }),
    keys: ['anotherverylongrandom32charsstri'],
  }).create()
}

export function freezeTime(at: Date) {
  const test = getActiveTestOrFail()

  timekeeper.freeze(at)
  test.cleanup(() => timekeeper.reset())

  return at
}

export async function rejection<T = Error>(callback: () => Promise<unknown>): Promise<T> {
  try {
    await callback()
  } catch (error) {
    return error as T
  }

  throw new Error('Expected the callback to reject')
}
