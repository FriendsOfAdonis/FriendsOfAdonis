import { type Database } from '@adonisjs/lucid/database'
import { type QueryClientContract } from '@adonisjs/lucid/types/database'
import {
  type IntrospectorContract,
  type DatabaseSchema,
  type TableSchema,
  type ColumnSchema,
  type IndexSchema,
} from '../../../types.ts'

/**
 * Introspect schema from database using Lucid ORM.
 */
export abstract class BaseDatabaseIntrospector implements IntrospectorContract {
  protected connection: QueryClientContract

  constructor(private db: Database) {
    const connectionName = this.db.primaryConnectionName
    this.connection = this.db.connection(connectionName)
  }

  async introspect(): Promise<DatabaseSchema> {
    const tables: Record<string, TableSchema> = {}

    for (const tableName of await this.connection.getAllTables()) {
      const [columns, indices] = await Promise.all([
        this.getColumns(tableName),
        this.getIndices(tableName),
      ])

      for (const [indexName, index] of Object.entries(indices)) {
        if (!index.isUnique || index.columns.length !== 1) continue
        delete indices[indexName]

        if (!columns[index.columns[0]].isPrimary) {
          columns[index.columns[0]].isUnique = true
        }
      }

      tables[tableName] = {
        columns,
        indices,
      }
    }

    return {
      tables,
    }
  }

  getTables(): Promise<string[]> {
    return this.connection.getAllTables()
  }

  abstract getColumns(tableName: string): Promise<Record<string, ColumnSchema>>
  abstract getIndices(tableName: string): Promise<Record<string, IndexSchema>>
}
