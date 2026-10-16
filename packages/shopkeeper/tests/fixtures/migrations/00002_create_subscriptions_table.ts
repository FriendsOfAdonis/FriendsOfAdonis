import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.string('type').notNullable()
      table.string('stripe_id').notNullable().unique()
      table.string('stripe_status').notNullable()
      table.string('stripe_price').nullable()
      table.integer('quantity').nullable()
      table.timestamp('trial_ends_at').nullable()
      table.timestamp('ends_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['user_id', 'stripe_status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
