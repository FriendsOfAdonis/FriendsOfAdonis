import { type ColumnOptions as BaseColumnOptions } from '@adonisjs/lucid/types/model'
import { type Knex } from 'knex'

export interface BaseSchemaOptions {
  /**
   * The mapping type to use for the column.
   */
  type: 'integer' | 'json' | string

  /**
   * Wether the column is a unique key.
   *
   * @default false
   */
  unique: boolean

  /**
   * Wether the column is nullable.
   *
   * @default false
   */
  nullable: boolean

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
}

export interface VarcharSchemaOptions extends BaseSchemaOptions {
  /**
   * Defines a "varchar" column.
   */
  type: 'varchar' | 'text'

  maxLength?: number
}

export interface DateTimeSchemaOptions extends BaseSchemaOptions {
  type: 'datetime'
  autoCreate?: boolean
  autoUpdate?: boolean
}

export type ColumnSchemaOptions = BaseSchemaOptions | VarcharSchemaOptions | DateTimeSchemaOptions

export interface VarcharColumnOptions extends BaseColumnOptions, VarcharSchemaOptions {}
export interface DateTimeColumnOptions extends BaseColumnOptions, DateTimeSchemaOptions {}

export type ColumnOptions =
  | VarcharColumnOptions
  | DateTimeColumnOptions
  | (BaseColumnOptions & BaseSchemaOptions)

export interface DatabaseSchema {
  tables: Record<string, TableSchema>
}

export interface TableSchema {
  columns: Record<string, ColumnSchema>
  indices: Record<string, IndexSchema>
}

export interface IndexSchema {
  columns: string[]
  unique: boolean
}

export type ColumnSchema = ColumnSchemaOptions

export interface ColumnInfo extends Knex.ColumnInfo {
  isPrimary: boolean
}

export interface IntrospectorContract {
  introspect(): Promise<DatabaseSchema>
}
