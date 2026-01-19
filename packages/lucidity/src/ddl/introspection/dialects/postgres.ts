import { type IndexSchema, type ColumnSchema, type KnexColumnType } from '../../../types.ts'
import { BaseDatabaseIntrospector } from './base.ts'

type ColumnInfoRow = {
  column_name: string
  data_type: string
  udt_name: string
  is_nullable: 'NO' | 'YES'
  column_default: string | null
  character_maximum_length: number | null
  full_type: string
  is_primary: boolean
  typmod: number
  check_clause: string | null
}

/**
 * PostgreSQL-specific database introspector using information_schema
 * and pg_catalog system tables.
 */
export class PostgresIntrospector extends BaseDatabaseIntrospector {
  /**
   * Get all table names in the public schema.
   * Overrides base method to avoid issues with Lucid's getAllTables for PostgreSQL.
   */
  async getTables(): Promise<string[]> {
    const result = await this.connection.rawQuery(`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename ASC
    `)
    return result.rows.map((row: { tablename: string }) => row.tablename)
  }

  /**
   * Get column metadata for a table using information_schema.columns
   * and pg_constraint for primary key detection.
   */
  async getColumns(table: string): Promise<Record<string, ColumnSchema>> {
    const output: Record<string, ColumnSchema> = {}
    const result: { rows: ColumnInfoRow[] } = await this.connection.rawQuery(`
  SELECT
    c.column_name,
    c.data_type,
    c.udt_name,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,

    -- Raw typmod from pg_attribute (can be used to extract length for types like varchar, vector, etc.)
    a.atttypmod AS typmod,

    -- Human-readable type including length/dimensions
    format_type(a.atttypid, a.atttypmod) AS full_type,

    CASE
      WHEN pk.column_name IS NOT NULL THEN true
      ELSE false
    END AS is_primary,

    -- Check constraint (if any) for this column
    cc.check_clause

  FROM information_schema.columns c

  -- join pg_catalog to get typmod
  JOIN pg_class cls
    ON cls.relname = c.table_name
  JOIN pg_namespace ns
    ON ns.oid = cls.relnamespace
   AND ns.nspname = c.table_schema
  JOIN pg_attribute a
    ON a.attrelid = cls.oid
   AND a.attname = c.column_name
   AND a.attnum > 0
   AND NOT a.attisdropped

  -- primary key info
  LEFT JOIN (
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_name = '${table}'
      AND tc.table_schema = 'public'
  ) pk ON c.column_name = pk.column_name

  -- column-level check constraints
  LEFT JOIN LATERAL (
    SELECT pg_get_constraintdef(con.oid) AS check_clause
    FROM pg_constraint con
    WHERE con.conrelid = cls.oid
      AND con.contype = 'c'            -- check constraint
      AND a.attnum = ANY(con.conkey)  -- column is involved in constraint
    LIMIT 1
  ) cc ON true

  WHERE c.table_name = '${table}'
    AND c.table_schema = 'public'

  ORDER BY c.ordinal_position
`)

    for (const col of result.rows) {
      let type = this.normalizeSQLType(col.data_type, col.udt_name)
      let values: string[] | undefined

      if (col.typmod >= 0 && !['varchar', 'integer', 'binary', 'tinyint'].includes(type)) {
        type = col.full_type
      }

      if (type === 'text' && col.check_clause) {
        values = this.extractEnumValuesFromCheckClause(col.check_clause)
      }

      output[col.column_name] = {
        type,
        isPrimary: col.is_primary,
        isNullable: col.is_nullable === 'YES',
        default: this.normalizeDefault(col.column_default),
        maxLength: this.normalizeMaxLength(type, col.character_maximum_length),
        isUnique: false, // Defaults to false, replaced if we find unique index
        autoIncrement: false,
        values,
      }
    }

    return output
  }

  normalizeSQLType(_dataType: string, udtName: string) {
    const mapping: NodeJS.Dict<string> = {
      timestamptz: 'datetime',
      int2: 'smallint',
      int4: 'integer',
      int8: 'bigint',
      float4: 'float',
      float8: 'double',
      bool: 'boolean',
      bytea: 'binary',
    }

    const type = mapping[udtName]

    return type ?? udtName
  }

  /**
   * Get index metadata using pg_indexes and pg_index system tables.
   */
  async getIndices(table: string): Promise<Record<string, IndexSchema>> {
    const output: Record<string, IndexSchema> = {}

    const result = await this.connection.rawQuery(`
      SELECT
        i.relname as index_name,
        ix.indisunique as is_unique,
        array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum)) as columns
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE t.relname = '${table}'
        AND n.nspname = 'public'
        AND t.relkind = 'r'
        AND NOT ix.indisprimary
      GROUP BY i.relname, ix.indisunique
    `)

    for (const idx of result.rows) {
      // PostgreSQL returns array_agg as '{col1,col2}' string format
      // Need to parse it into an actual array
      const columns = this.#parsePostgresArray(idx.columns)

      output[idx.index_name] = {
        isUnique: idx.is_unique,
        columns,
      }
    }

    return output
  }

  /**
   * Parse PostgreSQL array format '{item1,item2}' into JavaScript array.
   */
  #parsePostgresArray(value: string | string[]): string[] {
    // If already an array (some drivers do this automatically), return it
    if (Array.isArray(value)) {
      return value
    }

    // Parse PostgreSQL array format: {item1,item2,item3}
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      const inner = value.slice(1, -1)
      if (inner === '') {
        return []
      }
      return inner.split(',')
    }

    return []
  }

  toSQLType(type: KnexColumnType) {
    const mapping: Record<string, string> = {
      decimal: 'numeric(8,2)',
      tinyint: 'smallint',
      mediumint: 'integer',
      string: 'varchar',
      numeric: 'numeric(8,2)', // TODO: We might want to parse this properly
      timestamp: 'datetime',
    }

    return mapping[type] ?? type
  }

  /**
   * Normalize default values from PostgreSQL format.
   * PostgreSQL adds type casts like '0'::integer or 'pending'::character varying.
   */
  protected normalizeDefault(defaultValue: string | null): string | undefined {
    if (defaultValue === null) {
      return undefined
    }

    // Handle nextval() for serial/bigserial columns (auto-increment)
    if (defaultValue.startsWith('nextval(')) {
      return undefined
    }

    // Handle now() function
    if (defaultValue === 'now()') {
      return 'CURRENT_TIMESTAMP'
    }

    const stripped = this.stripTypeCast(defaultValue)

    if (stripped.match(/^'(.+)'$/)) {
      return stripped.slice(1, stripped.length - 1)
    }

    return stripped
  }

  protected stripTypeCast(value: string) {
    const castMatch = value.match(/^(.+)::[\w\s]+$/)
    return castMatch ? castMatch[1] : value
  }

  protected extractEnumValuesFromCheckClause(clause: string) {
    const matches = clause.match(/ARRAY\[(.*?)\]/)
    if (!matches) return
    return matches[1].split(', ').map((s) => this.stripTypeCast(s).replace(/'/g, '').trim())
  }
}
