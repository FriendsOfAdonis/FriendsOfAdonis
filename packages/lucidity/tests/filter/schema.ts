import { type Database } from '@adonisjs/lucid/database'

const TABLES = ['posts', 'users']

export async function setupSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('first_name').notNullable()
    table.string('last_name').nullable()
    table.string('email').notNullable()
    table.integer('age').nullable()
    table.timestamp('created_at')
  })

  await connection.schema.createTable('posts', (table) => {
    table.increments('id')
    table.string('title').notNullable()
    table.boolean('published').notNullable().defaultTo(false)
    table.integer('user_id').references('users.id')
  })

  return async () => {
    for (const tableName of TABLES) {
      await connection.schema.dropTableIfExists(tableName)
    }
  }
}
