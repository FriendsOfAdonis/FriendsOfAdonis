import { type StandardJSONSchemaV1 } from '@standard-schema/spec'
import { E_INVALID_API_SCHEMA } from '../exceptions.ts'
import { type OpenAPIV3_1 } from 'openapi-types'
import { ApiBody, ApiCookie, ApiHeader, ApiParam, ApiQuery } from '../decorators.ts'

function isValidApiSchema(schema: unknown): schema is OpenAPIV3_1.NonArraySchemaObject {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'type' in schema &&
    schema.type === 'object' &&
    'properties' in schema
  )
}

function* iterateSchemaProperties(
  schema: unknown,
  target: Object,
  propertyKey: string,
  position: string
) {
  if (isValidApiSchema(schema)) {
    for (const [key, value] of Object.entries(schema.properties ?? {})) {
      yield { key, value, required: schema.required?.includes(key) ?? false }
    }

    return
  }

  throw new E_INVALID_API_SCHEMA([target.constructor.name, propertyKey, position])
}

export interface ApiSchemaOptions {
  body?: Parameters<typeof ApiBody>[0]
}

export function ApiSchema(schema: StandardJSONSchemaV1, options?: ApiSchemaOptions) {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const output = schema['~standard'].jsonSchema.input({ target: 'openapi-3.0' }) as unknown

    if (isValidApiSchema(output)) {
      const { params, qs, cookies, headers, ...body } = output.properties ?? {}

      if (params) {
        for (const { key, value, required } of iterateSchemaProperties(
          params,
          target,
          propertyKey,
          'params'
        )) {
          ApiParam({ name: key, schema: value as any, required })(target, propertyKey)
        }
      }

      if (qs) {
        for (const { key, value, required } of iterateSchemaProperties(
          qs,
          target,
          propertyKey,
          'query'
        )) {
          ApiQuery({ name: key, schema: value as any, required })(target, propertyKey)
        }
      }

      if (headers) {
        for (const { key, value, required } of iterateSchemaProperties(
          headers,
          target,
          propertyKey,
          'headers'
        )) {
          ApiHeader({ name: key, schema: value as any, required })(target, propertyKey)
        }
      }

      if (cookies) {
        for (const { key, value, required } of iterateSchemaProperties(
          cookies,
          target,
          propertyKey,
          'cookies'
        )) {
          ApiCookie({ name: key, schema: value as any, required })(target, propertyKey)
        }
      }

      if (Object.entries(body).length > 0) {
        const required = (output.required ?? []).filter(
          (key) => !['params', 'qs', 'headers', 'cookies'].includes(key)
        )

        ApiBody({
          schema: {
            ...output,
            properties: body,
            required,
          } as any,
          ...options?.body,
        })(target, propertyKey, descriptor)
      }

      return
    }

    throw new E_INVALID_API_SCHEMA(['root', target.constructor.name, propertyKey])
  }
}
