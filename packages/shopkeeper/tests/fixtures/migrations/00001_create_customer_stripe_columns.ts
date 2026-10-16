import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('stripe_id').nullable().index()
      table.string('pm_type').nullable()
      table.string('pm_last_four', 4).nullable()
      table.timestamp('trial_ends_at').nullable()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at')
    })
  }
}
