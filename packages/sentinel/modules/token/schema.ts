import { Knex } from 'knex'

export class TokenSchema {
  /**
   * Configures tokens table columns.
   */
  static configureTokensTable(table: Knex.CreateTableBuilder) {
    table.increments('id')
    table.integer('tokenable_id').notNullable()
    table.string('kind').notNullable()
    table.string('name').nullable()
    table.string('purpose').nullable()
    table.string('hash').notNullable()
    table.integer('usage_count').notNullable().defaultTo(0)
    table.integer('maximum_usage_count').notNullable()
    table.integer('failed_attempts_count').notNullable().defaultTo(0)
    table.integer('maximum_failed_attempts_count').nullable()
    table.text('metadata').nullable()
    table.timestamp('expires_at').notNullable()
    table.timestamp('last_used_at').nullable()
    table.timestamp('created_at').notNullable()
  }
}
