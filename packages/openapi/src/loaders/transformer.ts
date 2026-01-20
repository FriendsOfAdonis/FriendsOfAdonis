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

    return resolveSchema(context, value.transformer, schema, value.variant)
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

      if (data.type === 'array') {
        const resolved = findSchema(context, schema)
        properties[key] = {
          ...data,
          items: resolveSchema(context, value.transformer, resolved, value.variant),
        }
      }

      if (data.type === 'object') {
        const resolved = findSchema(context, schema)
        properties[key] = resolveSchema(context, value.transformer, resolved, value.variant)
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
  variant: string
) {
  const transformed = transformSchema(
    context,
    transformerClass,
    findSchema(context, schema),
    variant
  )
  const name = `${transformerClass.name}_${variant}`
  context.schemas[name] = transformed
  return { $ref: getSchemaPath(name) }
}

export class TransformerSchema<
  Transformer extends Constructor<BaseTransformer<unknown>> = Constructor<BaseTransformer<unknown>>,
> {
  constructor(
    public transformer: Transformer,
    public resource: ExtractTransformerResource<InstanceType<Transformer>>,
    public variant: string = 'toObject'
  ) {}

  useVariant<V extends ExtractTransformerVariants<InstanceType<Transformer>>>(variant: V) {
    this.variant = variant
    return this
  }
}

BaseTransformer.schema = function (this, model) {
  return new TransformerSchema(this, model)
}
