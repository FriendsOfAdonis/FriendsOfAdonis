import { type Database } from '@adonisjs/lucid/database'

const TABLES = ['images', 'comments', 'tags', 'posts', 'videos']

export async function setupSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.createTable('posts', (table) => {
    table.increments('id')
    table.string('title').notNullable()
  })

  await connection.schema.createTable('videos', (table) => {
    table.increments('id')
    table.string('title').notNullable()
  })

  await connection.schema.createTable('images', (table) => {
    table.increments('id')
    table.string('url').notNullable()
    table.string('imageable_type').nullable()
    table.integer('imageable_id').nullable()
    table.index(['imageable_type', 'imageable_id'])
  })

  await connection.schema.createTable('comments', (table) => {
    table.increments('id')
    table.text('body').notNullable()
    table.string('commentable_type').nullable()
    table.integer('commentable_id').nullable()
    table.index(['commentable_type', 'commentable_id'])
  })

  await connection.schema.createTable('tags', (table) => {
    table.increments('id')
    table.string('name').notNullable()
    table.string('taggable_type').nullable()
    table.integer('taggable_id').nullable()
    table.index(['taggable_type', 'taggable_id'])
  })

  return async () => {
    for (const tableName of TABLES) {
      await connection.schema.dropTableIfExists(tableName)
    }
  }
}
