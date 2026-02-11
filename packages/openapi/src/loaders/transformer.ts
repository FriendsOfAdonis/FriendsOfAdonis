import stringHelpers from '@adonisjs/core/helpers/string'
import { BaseTransformer, Item } from '@adonisjs/core/transformers'
import { type Constructor } from '@adonisjs/core/types/common'
import { type ExtractTransformerVariants } from '@adonisjs/core/types/transformers'
import { type Context, loadType } from '@martin.xyz/openapi-decorators'
import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'
import { getSchemaPath } from '@martin.xyz/openapi-decorators/utils'
import { type OpenAPIV3 } from 'openapi-types'

export type ExtractTransformerResource<Transformer> =
  Transformer extends BaseTransformer<infer U> ? Constructor<U> : never

export const TransformerLoader: TypeLoaderFn = async (context, value) => {
  if (value instanceof TransformerSchema) {
    const schema = await loadSchema(context, value.resource)
    if (!schema) {
      context.logger.warn('error....')
      return
    }

    return resolveSchema(context, value.transformer, schema, value.variant, value.isPaginated)
  }
}

export async function loadSchema(context: Context, value: any) {
  const schema = await loadType(context, { type: () => value })
  if (schema) {
    return findSchema(context, schema)
  }
}

function findSchema(context: Context, schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject) {
  if ('$ref' in schema) {
    const segments = schema.$ref.split('/')
    const name = segments[segments.length - 1]
    return context.schemas[name]
  }

  return schema
}

function transformSchema(
  context: Context,
  transformerClass: Constructor<BaseTransformer<unknown>>,
  schema: OpenAPIV3.SchemaObject,
  variant: string
): OpenAPIV3.SchemaObject {
  const transformer = new transformerClass(schema.properties) as any
  const properties = transformer[variant]()

  // Resolve relationships
  for (const [key, value] of Object.entries(properties)) {
    if (value instanceof Item) {
      const data = (value as any).transformerData[0] as OpenAPIV3.SchemaObject

      if ('$ref' in data) {
        const resolved = findSchema(context, data)
        properties[key] = resolveSchema(context, value.transformer, resolved, value.variant, false)
        continue
      }

      if (data.type === 'array') {
        const resolved = findSchema(context, schema)
        properties[key] = {
          ...data,
          items: resolveSchema(context, value.transformer, resolved, value.variant, false),
        }
      }

      if (data.type === 'object') {
        const resolved = findSchema(context, schema)
        properties[key] = resolveSchema(context, value.transformer, resolved, value.variant, false)
      }
    }
  }

  return {
    ...schema,
    required: schema.required?.filter((required) => properties[required]),
    properties,
  }
}

function resolveSchema(
  context: Context,
  transformerClass: Constructor<BaseTransformer<unknown>>,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  variant: string,
  isPaginated: boolean
): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject {
  const a = stringHelpers.create(transformerClass.name).removeSuffix('Transformer').toString()
  const b = stringHelpers.create(variant).removePrefix('to')
  const name = stringHelpers.create(`${a}_${b}`).pascalCase().toString()

  if (!context.schemas[name]) {
    const transformed = transformSchema(
      context,
      transformerClass,
      findSchema(context, schema),
      variant
    )
    context.schemas[name] = transformed
  }

  if (isPaginated) {
    return {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(name) },
        },
        metadata: {
          type: 'object',
          properties: {
            firstPage: { type: 'number' },
            lastPage: { type: 'number' },
            perPage: { type: 'number' },
            total: { type: 'number' },
          },
        },
      },
      required: ['data', 'meta'],
    }
  }

  return { $ref: getSchemaPath(name) }
}

export class TransformerSchema<
  Transformer extends Constructor<BaseTransformer<unknown>> = Constructor<BaseTransformer<unknown>>,
> {
  constructor(
    public transformer: Transformer,
    public resource: ExtractTransformerResource<InstanceType<Transformer>>,
    public variant: string = 'toObject',
    public isPaginated = false
  ) {}

  paginated() {
    this.isPaginated = true
    return this
  }

  useVariant<V extends ExtractTransformerVariants<InstanceType<Transformer>>>(variant: V) {
    this.variant = variant
    return this
  }
}

BaseTransformer.schema = function (this, model) {
  return new TransformerSchema(this, model)
}
