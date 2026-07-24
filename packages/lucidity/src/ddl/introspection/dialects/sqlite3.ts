import { type IndexSchema, type ColumnSchema, type KnexColumnType } from '../../../types.ts'
import { BaseDatabaseIntrospector } from './base.ts'

const maxLengthRegex = /.*\((\d+)\)/

type TableInfoRow = {
  cid: number
  name: string
  type: string
  notnull: 0 | 1
  dflt_value: null | 'string'
  pk: 0 | 1
}

export class SQLite3Introspector extends BaseDatabaseIntrospector {
  async getColumns(table: string) {
    const output: Record<string, ColumnSchema> = {}
    const columns: TableInfoRow[] = await this.connection.rawQuery(
      `PRAGMA table_info(\`${table}\`)`
    )

    for (const item of columns) {
      const match = item.type.match(maxLengthRegex)
      const maxLength = match ? Number(match[1]) : undefined

      const type = this.normalizeSQLType(
        (maxLength !== undefined ? item.type.split('(')[0] : item.type).toLowerCase()
      )
      const isPrimary = item.pk === 1
      const isNullable = item.notnull === 0

      // We assume PK INTEGER are always autoincrement
      const autoIncrement = (type === 'integer' || type === 'bigint') && isPrimary

      output[item.name] = {
        type: type,
        isPrimary: Boolean(item.pk),
        isNullable: isNullable,
        default: this.#normalizeDefault(item.dflt_value),
        maxLength: this.normalizeMaxLength(type, maxLength),
        isUnique: false, // Defaults to false, replaced if we find unique index
        autoIncrement,
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

  normalizeSQLType(value: string) {
    const mapping: NodeJS.Dict<string> = {
      blob: 'binary',
    }

    const type = mapping[value]

    return type ?? value
  }

  /**
   * Transforms a known column type to sql type.
   *
   * @see {@link https://github.com/knex/knex/blob/master/lib/dialects/sqlite3/schema/sqlite-columncompiler.js#L38}
   */
  toSQLType(type: KnexColumnType) {
    const mapping: Record<string, string> = {
      double: 'float',
      decimal: 'float',
      jsonb: 'json',
      timestamp: 'datetime',
      smallint: 'integer',
      mediumint: 'integer',
      string: 'varchar',
      uuid: 'char',
    }

    return mapping[type] ?? type
  }

  #normalizeDefault(value: string | null) {
    if (value === null) return undefined
    if (value.match(/^'(.+)'$/)) {
      return value.slice(1, value.length - 1)
    }

    return value
  }
}
