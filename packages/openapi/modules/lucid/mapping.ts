import { type PropertyMetadata } from '@martin.xyz/openapi-decorators/metadata'

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
