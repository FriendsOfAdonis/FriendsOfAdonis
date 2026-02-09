import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'
import { type StandardJSONSchemaV1 } from '@standard-schema/spec'

function supportsStandardJSONSchema(value: unknown): value is StandardJSONSchemaV1 {
  if (
    typeof value === 'object' &&
    value !== null &&
    '~standard' in value &&
    typeof value['~standard'] === 'object' &&
    value['~standard'] !== null &&
    'jsonSchema' in value['~standard']
  ) {
    return true
  }

  return false
}

/**
 * Converts value that follow the StandardJSONSchemaV1 standard.
 */
export const StandardJSONSchemaLoader: TypeLoaderFn = async (_, value) => {
  if (supportsStandardJSONSchema(value)) {
    return value['~standard'].jsonSchema.input({ target: 'openapi-3.0' })
  }
}
