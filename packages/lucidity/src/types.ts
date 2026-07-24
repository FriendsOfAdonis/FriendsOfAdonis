import { type ColumnOptions as BaseColumnOptions } from '@adonisjs/lucid/types/model'
import { type Knex } from 'knex'

export interface BaseSchemaOptions {
  /**
   * The mapping type to use for the column.
   */
  type: KnexColumnType | (string & {})

  /**
   * Wether the column is a unique key.
   *
   * @default false
   */
  isUnique: boolean

  /**
   * Wether the column is nullable.
   *
   * @default false
   */
  isNullable: boolean

  /**
   * Default value in SQL format.
   */
  default?: string

  /**
   * Wether the column is primary.
   *
   * @default false
   */
  isPrimary: boolean

  /**
   * Wether the column is autoincrements.
   *
   * @default false
   */
  autoIncrement: boolean

  /**
   * Maximum length for string-like columns (e.g., varchar, char).
   */
  maxLength?: number

  /**
   * List of enum values for enum-like columns.
   */
  values?: string[]
}

export interface IndexOptions {
  /**
   * Name of the foreign key.
   */
  name: string

  /**
   * Columns included in the foreign key.
   */
  columns: string[]

  /**
   * Foreign key ON DELETE action.
   */
  onDelete?: 'CASCASE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION'

  /**
   * Foreign key ON UPDATE action.
   */
  onUpdate?: 'CASCASE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION'
}

export interface DateTimeSchemaOptions extends BaseSchemaOptions {
  type: 'datetime'
  autoCreate?: boolean
  autoUpdate?: boolean
}

export interface EnumSchemaOptions extends BaseSchemaOptions {
  type: 'enum'
  values: string[]
}

export type ColumnSchemaOptions = BaseSchemaOptions | DateTimeSchemaOptions | EnumSchemaOptions

export interface DateTimeColumnOptions extends BaseColumnOptions, DateTimeSchemaOptions {}

export type ColumnOptions = BaseColumnOptions & BaseSchemaOptions

export interface DatabaseSchema {
  tables: Record<string, TableSchema>
}

export interface TableSchema {
  columns: Record<string, ColumnSchema>
  indices: Record<string, IndexSchema>
  foreignKeys: Record<string, ForeignKeySchema>
}

export interface IndexSchema {
  columns: string[]
  isUnique: boolean
}

export type ColumnSchema = {
  type: string

  isUnique: boolean
  isPrimary: boolean
  isNullable: boolean

  autoIncrement: boolean
  maxLength?: number
  default?: string
  values?: string[]
}

export type ForeignKeySchema = {
  columns: string[]
  onUpdate?: string
  onDelete?: string
}

export interface ColumnInfo extends Knex.ColumnInfo {
  isPrimary: boolean
}

export interface IntrospectorContract {
  introspect(): Promise<DatabaseSchema>
}

/**
 * List of known types handled by Knex table builder.
 */
export type KnexColumnType =
  | 'integer'
  | 'tinyint'
  | 'smallint'
  | 'mediumint'
  | 'bigint'
  | 'text'
  | 'string'
  | 'float'
  | 'double'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'timestamp'
  | 'geometry'
  | 'geography'
  | 'point'
  | 'binary'
  | 'enum'
  | 'json'
  | 'jsonb'
  | 'uuid'

export type KnexTableBuilderMethod = keyof Knex.CreateTableBuilder
export type KnexColumnBuilderMethod = keyof Knex.ColumnBuilder
