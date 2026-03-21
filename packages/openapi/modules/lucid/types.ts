import { type ColumnInfo, type DatabaseColumn } from '@adonisjs/lucid/types/schema_generator'

export type ColumnInfoFn = (dataType: string, column: DatabaseColumn) => ColumnInfo
