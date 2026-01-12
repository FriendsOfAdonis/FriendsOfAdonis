import { type IndexSchema, type ColumnSchema } from '../../../types.ts'
import { BaseDatabaseIntrospector } from './base.ts'

const maxLengthRegex = /.*\((\d+)\)/

export class SQLite3Introspector extends BaseDatabaseIntrospector {
  async getColumns(table: string) {
    const output: Record<string, ColumnSchema> = {}
    const columns = await this.connection.rawQuery(`PRAGMA table_info(\`${table}\`)`)

    for (const item of columns) {
      let maxLength = item.type.match(maxLengthRegex)
      if (maxLength) {
        maxLength = maxLength[1]
      }

      const type = maxLength ? item.type.split('(')[0] : item.type

      output[item.name] = {
        type: type.toLowerCase(),
        isPrimary: Boolean(item.pk),
        nullable: !item.notnull,
        default: item.dflt_value ?? undefined,
        maxLength,
        unique: false, // Defaults to unique, replaced if we find index
      }
    }

    return output
  }

  async getIndices(table: string): Promise<Record<string, IndexSchema>> {
    const output: Record<string, IndexSchema> = {}
    const indices = await this.connection.rawQuery(`PRAGMA index_list(\`${table}\`)`)

    for (const index of indices) {
      const info = await this.connection.rawQuery(`PRAGMA index_info(\`${index.name}\`)`)

      output[index.name] = {
        unique: Boolean(index.unique),
        columns: info.map((item: any) => item.name),
      }
    }

    return output
  }
}
