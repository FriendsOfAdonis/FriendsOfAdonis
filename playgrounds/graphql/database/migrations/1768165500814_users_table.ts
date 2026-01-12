import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('posts', (table) => {
      table.string('id').primary().notNullable()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('ingredients').notNullable()
      table.datetime('updated_at').notNullable()
      table.datetime('created_at').notNullable()
    })
    this.schema.alterTable('recipes', (table) => {
      table.dropNullable('updated_at')
      table.dropNullable('created_at')
    })
    this.schema.alterTable('users', (table) => {
      table.string('test').notNullable()
      table.dropNullable('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('posts')
    this.schema.alterTable('recipes', (table) => {
      table.setNullable('updated_at')
      table.setNullable('created_at')
    })
    this.schema.alterTable('users', (table) => {
      table.dropColumn('test')
      table.setNullable('updated_at')
    })
  }
}
