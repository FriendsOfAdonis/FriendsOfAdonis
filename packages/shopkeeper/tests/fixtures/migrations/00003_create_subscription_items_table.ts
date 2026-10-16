import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscription_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('subscription_id').unsigned().references('subscriptions.id').onDelete('CASCADE')

      table.string('stripe_id').notNullable().unique()
      table.string('stripe_product').notNullable()
      table.string('stripe_price').notNullable()
      table.integer('quantity').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['subscription_id', 'stripe_price'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
