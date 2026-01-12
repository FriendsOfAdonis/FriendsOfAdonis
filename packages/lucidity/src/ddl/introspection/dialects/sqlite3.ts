import { type IndexSchema, type ColumnSchema } from '../../../types.ts'
import { BaseDatabaseIntrospector } from './base.ts'

const maxLengthRegex = /.*\((\d+)\)/

export class SQLite3Introspector extends BaseDatabaseIntrospector {
  async getColumns(table: string) {
    const output: Record<string, ColumnSchema> = {}
    const columns = await this.connection.rawQuery(`PRAGMA table_info(\`${table}\`)`)

    for (const item of columns) {
      const match = item.type.match(maxLengthRegex)
      const maxLength = match ? Number(match[1]) : undefined

      const type = maxLength !== undefined ? item.type.split('(')[0] : item.type

      output[item.name] = {
        type: type.toLowerCase(),
        isPrimary: Boolean(item.pk),
        isNullable: !item.notnull,
        default: item.dflt_value ?? undefined,
        maxLength,
        isUnique: false, // Defaults to false, replaced if we find unique index
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
        isUnique: Boolean(index.unique),
        columns: info.map((item: any) => item.name),
      }
    }

    return output
  }
}
