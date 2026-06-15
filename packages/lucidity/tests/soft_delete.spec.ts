import { ApplicationService } from '@adonisjs/core/types'
import { Database } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import { setupDatabase } from './helpers.ts'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Factory from '@adonisjs/lucid/factories'
import { compose } from '@adonisjs/core/helpers'
import { withSoftDelete } from '../src/mixins/soft_delete.ts'

async function cleanSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.dropTableIfExists('users')
}

async function setupSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.createTable('users', (table) => {
    table.increments()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.timestamp('deleted_at').nullable()
    table.timestamp('updated_at').notNullable()
    table.timestamp('created_at').notNullable()
  })

  return () => cleanSchema(db)
}

class User extends compose(BaseModel, withSoftDelete()) {
  @column()
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}).build()

test.group('SoftDelete', (group) => {
  let db: Database
  let app: ApplicationService

  group.setup(async () => {
    const result = await setupDatabase({
      client: 'sqlite',
      connection: {
        filename: ':memory:',
      },
    })

    app = result.app
    db = result.db

    return setupSchema(db)
  })

  group.teardown(async () => {
    await app.terminate()
  })

  group.each.setup(() => db.connection().truncateAllTables())

  test('should return all users when none are trashed', async ({ expect }) => {
    await UserFactory.createMany(10)
    const users = await User.query()
    expect(users).toHaveLength(10)
  })

  test('should return only non trashed users when using query', async ({ expect }) => {
    await UserFactory.createMany(5)
    await UserFactory.merge({
      deletedAt: DateTime.now(),
    }).createMany(15)

    const users = await User.query()
    expect(users).toHaveLength(5)
  })

  test('should return only non trashed users when using find', async ({ expect }) => {
    const existing = await UserFactory.create()
    const trashed = await UserFactory.merge({ deletedAt: DateTime.now() }).create()

    expect(await User.find(existing.id)).toBeDefined()
    expect(await User.find(trashed.id)).toBeNull()
  })
})
