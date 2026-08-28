import { Knex } from 'knex'

export class TOTPSchema {
  /**
   * Configures TOTP authenticators table columns.
   *
   * The secret and the backup codes are stored encrypted rather than
   * hashed, their column therefore holds a payload longer than the
   * value it protects.
   *
   * "last_used_counter" holds the last time step a code was accepted
   * for. It counts the periods elapsed since the epoch and therefore
   * grows past a 32 bits integer for the shortest periods.
   */
  static configureAuthenticatorsTable(table: Knex.CreateTableBuilder) {
    table.increments('id')
    table.integer('tokenable_id').notNullable()
    table.string('label').nullable()
    table.text('secret').notNullable()
    table.text('backup_codes').notNullable()
    table.bigInteger('last_used_counter').nullable()
    table.integer('failed_verification_count').notNullable().defaultTo(0)
    table.timestamp('locked_until').nullable()
    table.timestamp('verified_at').nullable()
    table.timestamp('created_at').notNullable()
  }
}
