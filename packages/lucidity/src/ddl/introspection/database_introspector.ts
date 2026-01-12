import { type Database } from '@adonisjs/lucid/database'
import { type QueryClientContract } from '@adonisjs/lucid/types/database'
import { type DatabaseSchema, type IntrospectorContract } from '../../types.ts'
import { SQLite3Introspector } from './dialects/sqlite3.ts'
import { type BaseDatabaseIntrospector } from './dialects/base.ts'
import { type Constructor } from '@adonisjs/core/types/common'

const DIALECTS: Record<string, Constructor<BaseDatabaseIntrospector>> = {
  'better-sqlite3': SQLite3Introspector,
}

/**
 * Introspect schema from database using Lucid ORM.
 */
export class DatabaseIntrospector implements IntrospectorContract {
  protected connection: QueryClientContract

  constructor(private db: Database) {
    const connectionName = this.db.primaryConnectionName
    this.connection = this.db.connection(connectionName)
  }

  async introspect(): Promise<DatabaseSchema> {
    const dialect = this.connection.dialect.name

    const Introspector = DIALECTS[dialect]

    if (!Introspector) {
      throw new Error(`Dialect "${dialect}" not supported for introspection`) // TODO: SUpport dialects
    }

    const introspector = new Introspector(this.db)

    return introspector.introspect()
  }
}
