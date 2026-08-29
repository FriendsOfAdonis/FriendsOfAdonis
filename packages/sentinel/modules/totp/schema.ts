import { Knex } from 'knex'

/**
 * Helpers to define the schema of the authenticators table inside a
 * migration
 *
 * @example
 * this.schema.createTable('totp_authenticators', (table) => {
 *   TOTPSchema.configureAuthenticatorsTable(table)
 * })
 */
export class TOTPSchema {
  /**
   * Adds the columns expected by the "TOTPAuthenticator" model to the
   * table
   */
  static configureAuthenticatorsTable(table: Knex.CreateTableBuilder) {
    table.increments('id')
    table.integer('tokenable_id').notNullable()
    table.string('label').nullable()

    /**
     * The secret and the backup codes are encrypted, not hashed. The
     * payloads are longer than the values they protect
     */
    table.text('secret').notNullable()
    table.text('backup_codes').notNullable()

    /**
     * Number of time steps since the epoch. It exceeds 32 bits with
     * short periods
     */
    table.bigInteger('last_used_counter').nullable()

    table.integer('failed_verification_count').notNullable().defaultTo(0)
    table.timestamp('locked_until').nullable()
    table.timestamp('verified_at').nullable()
    table.timestamp('created_at').notNullable()
  }
}
