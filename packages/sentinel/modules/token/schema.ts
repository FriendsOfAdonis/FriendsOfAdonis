import { Knex } from 'knex'

/**
 * Helpers to define the schema of the tokens table inside a migration
 *
 * @example
 * this.schema.createTable('sentinel_tokens', (table) => {
 *   TokenSchema.configureTokensTable(table)
 * })
 */
export class TokenSchema {
  /**
   * Adds the columns expected by the lucid token provider to the
   * table
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
