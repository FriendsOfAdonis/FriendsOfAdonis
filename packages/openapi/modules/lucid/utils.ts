import { type ColumnInfo, type DatabaseColumn } from '@adonisjs/lucid/types/schema_generator'
import { type PropertyMetadata } from '@martin.xyz/openapi-decorators/metadata'
import { DEFAULT_PROPERTY_OPTIONS_MAPPING } from './mapping.ts'
import { DEFAULT_SCHEMA_RULES } from '@adonisjs/lucid/orm/schema_generator'
import { type ColumnInfoFn } from './types.ts'
import { inspect } from 'node:util'

export function generateColumnInfo(
  dataType: string,
  column: DatabaseColumn,
  defaultRule: ColumnInfo,
  propertyOptions: Partial<PropertyMetadata> = {}
): ColumnInfo {
  const defaultOptions = DEFAULT_PROPERTY_OPTIONS_MAPPING[dataType]

  return {
    tsType: defaultRule?.tsType ?? 'any',
    decorator: [
      ...[defaultRule?.decorator ?? []].flat(),
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
