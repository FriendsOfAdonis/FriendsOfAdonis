import { column as baseColumn, dateTimeColumn } from '@adonisjs/lucid/orm'
import {
  type DateTimeColumnOptions,
  type ColumnOptions,
  type VarcharColumnOptions,
  type ColumnSchema,
} from '../types.ts'
import { type LucidModel } from '@adonisjs/lucid/types/model'

export function addSchemaMeta(
  target: Object,
  propertyKey: string,
  options?: Partial<ColumnOptions>
) {
  const { columnName, serializeAs, serialize, prepare, consume, meta, ...schema } = options ?? {}

  const columnSchema: ColumnSchema = {
    type: 'varchar',
    nullable: false,
    unique: false,
    isPrimary: false,
    ...(schema as Partial<ColumnSchema>),
  }

  const Model = target.constructor as LucidModel
  const columnOptions = Model.$getColumn(propertyKey)!

  columnOptions.meta = {
    ...columnOptions.meta,
    schema: columnSchema,
  }
}

export function column(options?: Partial<ColumnOptions>) {
  return function (target: Object, propertyKey: string) {
    baseColumn(options)(target, propertyKey)
    addSchemaMeta(target, propertyKey, options)
  }
}

const createColumnDecorator = <T extends ColumnOptions = ColumnOptions>(type: T['type']) => {
  return (options?: Partial<Omit<T, 'type'>>) => column({ type, ...options })
}

column.varchar = createColumnDecorator<VarcharColumnOptions>('varchar')
column.string = createColumnDecorator<VarcharColumnOptions>('varchar')
column.text = createColumnDecorator<VarcharColumnOptions>('text')

column.integer = createColumnDecorator('integer')
column.json = createColumnDecorator('json')

column.dateTime = function datetime(options?: Partial<Omit<DateTimeColumnOptions, 'type'>>) {
  return function decorateAsColumn(target: Object, propertyKey: string) {
    dateTimeColumn(options)(target as any, propertyKey) // TODO: Types
    addSchemaMeta(target, propertyKey, {
      type: 'datetime',
      ...options,
    })
  }
}
