import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'

export interface WithJsonSchema {
  toJSONSchema(): Record<string, unknown>
}

function supportsToJsonSchema(value: unknown): value is WithJsonSchema {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toJSONSchema' in value &&
    typeof value.toJSONSchema === 'function'
  )
}

/**
 * Supports any object value that contains a `toJSONSchema` method.
 */
export const JSONSchemaLoader: TypeLoaderFn = async (_, value) => {
  if (supportsToJsonSchema(value)) {
    return value.toJSONSchema()
  }
}
