import { column as baseColumn, dateTimeColumn, dateColumn } from '@adonisjs/lucid/orm'
import {
  type DateTimeColumnOptions,
  type ColumnOptions,
  type KnexColumnType,
  type BaseSchemaOptions,
} from '../types.ts'
import { type LucidModel } from '@adonisjs/lucid/types/model'

export function addSchemaMeta(
  target: Object,
  propertyKey: string,
  options?: Partial<ColumnOptions>
) {
  const {
    type = 'string',
    isUnique = false,
    isPrimary = false,
    isNullable = false,
    autoIncrement = false,
    maxLength,
    values,
  } = options ?? {}

  const columnSchema: BaseSchemaOptions = {
    type,
    isNullable,
    isUnique,
    isPrimary,
    autoIncrement,
    default: options?.default,
    values,
    maxLength,
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

const createColumnDecorator = <T extends ColumnOptions = ColumnOptions>(
  type: KnexColumnType,
  defaultOptions: Partial<ColumnOptions> = {}
) => {
  return (options?: Partial<Omit<T, 'type'>>) => column({ type, ...defaultOptions, ...options })
}

column.increments = createColumnDecorator('integer', { autoIncrement: true })
column.bigIncrements = createColumnDecorator('bigint', { autoIncrement: true })

column.integer = createColumnDecorator('integer')
column.tinyint = createColumnDecorator('tinyint')
column.smallint = createColumnDecorator('smallint')
column.mediumint = createColumnDecorator('mediumint')
column.bigint = createColumnDecorator('bigint')
column.text = createColumnDecorator('text')
column.string = createColumnDecorator('string')
column.float = createColumnDecorator('float')
column.double = createColumnDecorator('double')
column.decimal = createColumnDecorator('decimal')
column.boolean = createColumnDecorator('boolean')
// column.date = createColumnDecorator('date')
// column.datetime = createColumnDecorator('datetime')
column.time = createColumnDecorator('time')
column.timestamp = createColumnDecorator('timestamp')
column.geometry = createColumnDecorator('geometry')
column.geography = createColumnDecorator('geography')
column.point = createColumnDecorator('point')
column.binary = createColumnDecorator('binary')
column.json = createColumnDecorator('json')
column.jsonb = createColumnDecorator('jsonb')
column.uuid = createColumnDecorator('uuid')

column.enum = function enumColumn(options: Partial<ColumnOptions> & { enum: string[] | object }) {
  return function decorateAsColumn(target: Object, propertyKey: string) {
    column(options)(target, propertyKey)

    const values = Array.isArray(options.enum) ? options.enum : Object.keys(options.enum)

    addSchemaMeta(target, propertyKey, {
      type: 'enum',
      values,
      ...options,
    })
  }
}

column.dateTime = function datetime(options?: Partial<Omit<DateTimeColumnOptions, 'type'>>) {
  return function decorateAsColumn(target: Object, propertyKey: string) {
    dateTimeColumn(options)(target as any, propertyKey) // TODO: Types
    addSchemaMeta(target, propertyKey, {
      type: 'datetime',
      ...options,
    })
  }
}

column.date = function datetime(options?: Partial<Omit<DateTimeColumnOptions, 'type'>>) {
  return function decorateAsColumn(target: Object, propertyKey: string) {
    dateColumn(options)(target as any, propertyKey) // TODO: Types
    addSchemaMeta(target, propertyKey, {
      type: 'date',
      ...options,
    })
  }
}
