import { DATA_TYPES_MAPPING, DEFAULT_SCHEMA_RULES } from '@adonisjs/lucid/orm/schema_generator'
import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'
import { generateSchemaColumn, generateSchemaType } from './utils.ts'

const rules: Required<SchemaRules> = {
  primaryKey: (_table, primaryKeys, columns) => {
    const columnName = primaryKeys[0]
    if (!columnName || !columns[columnName]) {
      return undefined
    }

    const column = columns[columnName]
    const internalType = DATA_TYPES_MAPPING[column.type] ?? column.type
    const inferredDataType =
      typeof DEFAULT_SCHEMA_RULES.types[internalType] === 'function'
        ? DEFAULT_SCHEMA_RULES.types[internalType](internalType, column)
        : DEFAULT_SCHEMA_RULES.types[internalType]

    return {
      columnName,
      columnInfo: {
        tsType: inferredDataType?.tsType ?? column.type,
        imports: inferredDataType?.imports ?? [],
        decorator: '@column({ isPrimary: true })',
      },
    }
  },
  types: {
    number: generateSchemaType(),
    bigint: generateSchemaType(),
    decimal: generateSchemaType(),
    boolean: generateSchemaType(),
    string: generateSchemaType(),
    date: generateSchemaType(),
    time: generateSchemaType(),
    binary: generateSchemaType(),
    json: generateSchemaType(),
    jsonb: generateSchemaType(),
    DateTime: generateSchemaType(),
    uuid: generateSchemaType(),
    enum: generateSchemaType(),
    set: generateSchemaType(),
    unknown: generateSchemaType(),
  },
  columns: {
    id: generateSchemaColumn('id'),
    updated_at: generateSchemaColumn('updated_at'),
    created_at: generateSchemaColumn('created_at'),
  },
  tables: {},
}

export default rules
