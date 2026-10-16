import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stripe_webhook_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('event_id').primary()
      table.timestamp('created_at').notNullable()
      table.json('event_payload').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
