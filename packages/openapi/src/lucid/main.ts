import { type DatabaseColumn, type ColumnInfo } from '@adonisjs/lucid/types/schema_generator'
import { DEFAULT_SCHEMA_RULES } from '@adonisjs/lucid/orm/schema_generator'
import { type PropertyMetadata } from '@martin.xyz/openapi-decorators/metadata'
import { inspect } from 'node:util'

type ColumnInfoFn = (dataType: string, column: DatabaseColumn) => ColumnInfo

export const DEFAULT_PROPERTY_OPTIONS_MAPPING: Record<string, Partial<PropertyMetadata>> = {
  number: { type: 'number', format: 'int32' },
  bigint: { type: 'number', format: 'int64' },
  decimal: { type: 'string', format: 'decimal', pattern: '^-?\d+(\.\d+)?$' },
  boolean: { type: 'boolean' },
  string: { type: 'string' },
  date: { type: 'string', format: 'date' },
  time: { type: 'string', format: 'time' },
  binary: { type: 'string', format: 'binary' },
  json: {},
  jsonb: {},
  DateTime: { type: 'string', format: 'date-time' },
  uuid: { type: 'string', format: 'uuid' },
  enum: { type: 'string' },
  set: { type: 'string' },
  unknown: { schema: {} },
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

export { default as DEFAULT_SCHEMA_RULES } from './schema_rules.ts'
