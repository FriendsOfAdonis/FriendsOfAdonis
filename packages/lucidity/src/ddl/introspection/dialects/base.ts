import { type Database } from '@adonisjs/lucid/database'
import { type QueryClientContract } from '@adonisjs/lucid/types/database'
import {
  type IntrospectorContract,
  type DatabaseSchema,
  type ColumnSchema,
  type IndexSchema,
  type KnexColumnType,
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
    const schema: DatabaseSchema = {
      tables: {},
    }

    const tables = await this.getTables()

    await Promise.all(
      tables.map(async (tableName) => {
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

        schema.tables[tableName] = {
          columns,
          indices,
          foreignKeys: {},
        }
      })
    )

    return schema
  }

  async introspectTable(table: string) {
    const [columns, indices] = await Promise.all([this.getColumns(table), this.getIndices(table)])

    for (const [indexName, index] of Object.entries(indices)) {
      if (!index.isUnique || index.columns.length !== 1) continue
      delete indices[indexName]

      if (!columns[index.columns[0]].isPrimary) {
        columns[index.columns[0]].isUnique = true
      }
    }

    return {
      columns,
      indices,
    }
  }

  /**
   * Returns undefined when the max length is the default value for the column type.
   */
  protected normalizeMaxLength(type: string, maxLength?: number | null) {
    if (maxLength === undefined || maxLength === null) return
    if (type === 'varchar' && maxLength === 255) return undefined
    return maxLength
  }

  toSQLType(type: KnexColumnType): string {
    return type
  }

  getTables(): Promise<string[]> {
    return this.connection.getAllTables()
  }

  abstract getColumns(tableName: string): Promise<Record<string, ColumnSchema>>
  abstract getIndices(tableName: string): Promise<Record<string, IndexSchema>>
}
