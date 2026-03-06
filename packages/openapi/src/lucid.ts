import {
  type DatabaseColumn,
  type ColumnInfo,
  type SchemaRules,
} from '@adonisjs/lucid/types/schema_generator'
import { DEFAULT_SCHEMA_RULES } from '@adonisjs/lucid/orm/schema_generator'
import { type PropertyMetadata } from '@martin.xyz/openapi-decorators/metadata'
import { inspect } from 'node:util'

type ColumnInfoFn = (dataType: string, column: DatabaseColumn) => ColumnInfo

export const DEFAULT_PROPERTY_OPTIONS_MAPPING: Record<string, Partial<PropertyMetadata>> = {
  number: { type: 'number' },
  bigint: { type: 'bigint' },
  decimal: { type: 'string' },
  boolean: { type: 'boolean' },
  string: { type: 'string' },
  date: { type: 'string' },
  time: { type: 'string' },
  binary: { type: 'string', format: 'binary' },
  json: { schema: {} },
  jsonb: { schema: {} },
  DateTime: { type: 'string' },
  uuid: { type: 'string', format: 'uuid' },
  enum: { type: 'string' },
  set: { type: 'string' },
  unknown: { schema: {} },
}

export const DEFAULT_OPENAPI_SCHEMA_RULES: Required<SchemaRules> = {
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

export function generateColumnInfo(
  dataType: string,
  column: DatabaseColumn,
  defaultRule: ColumnInfo,
  propertyOptions: Partial<PropertyMetadata> = {}
): ColumnInfo {
  const defaultOptions = DEFAULT_PROPERTY_OPTIONS_MAPPING[dataType]

  return {
    tsType: defaultRule?.tsType ?? 'any',
    decorators: [
      ...[defaultRule?.decorators ?? []].flat(),
      generateApiPropertyDecorator({
        nullable: column.nullable,
        ...defaultOptions,
        ...propertyOptions,
      }),
    ],
    imports: [
      ...(defaultRule?.imports ?? []),
      {
        source: '@foadonis/openapi/decorators',
        namedImports: ['ApiProperty'],
      },
    ],
  }
}

export function generateSchemaType(propertyOptions: Partial<PropertyMetadata> = {}): ColumnInfoFn {
  return (dataType, column) => {
    const defaultRuleDef = DEFAULT_SCHEMA_RULES.types[dataType]
    const defaultRule =
      typeof defaultRuleDef === 'function' ? defaultRuleDef(dataType, column) : defaultRuleDef

    return generateColumnInfo(dataType, column, defaultRule, propertyOptions)
  }
}

export function generateSchemaColumn(dataColumn: string): ColumnInfoFn {
  return (dataType, column) => {
    const defaultRuleDef = DEFAULT_SCHEMA_RULES.columns[dataColumn]
    const defaultRule =
      typeof defaultRuleDef === 'function' ? defaultRuleDef(dataType, column) : defaultRuleDef

    return generateColumnInfo(dataType, column, defaultRule)
  }
}

export function generateApiPropertyDecorator(options: Partial<PropertyMetadata>) {
  const str = inspect(options, { showHidden: false, depth: null, colors: false })
  return `@ApiProperty(${str})`
}
