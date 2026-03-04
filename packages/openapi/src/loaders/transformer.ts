import { Container, type ContainerResolver } from '@adonisjs/core/container'
import { RuntimeException } from '@adonisjs/core/exceptions'
import stringHelpers from '@adonisjs/core/helpers/string'
import {
  BaseSerializer,
  BaseTransformer,
  Collection,
  Item,
  Paginator,
} from '@adonisjs/core/transformers'
import { type Constructor } from '@adonisjs/core/types/common'
import {
  type ResourceData,
  type JSONDataTypes,
  type ResourceDataTypes,
} from '@adonisjs/core/types/transformers'
import { type SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'
import { type Context, loadType } from '@martin.xyz/openapi-decorators'
import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'
import { inspect } from 'node:util'
import { type OpenAPIV3_1, type OpenAPIV3 } from 'openapi-types'

export const LUCID_PAGINATOR_METADATA_SCHEMA: PaginationMetadataSchema<SimplePaginatorMetaKeys> = {
  type: 'object',
  properties: {
    total: { type: 'number' },
    perPage: { type: 'number' },
    firstPage: { type: 'number' },
    firstPageUrl: { type: 'string' },
    currentPage: { type: 'number' },
    lastPage: { type: 'number' },
    lastPageUrl: { type: 'string' },
    previousPageUrl: { type: 'string' },
    nextPageUrl: { type: 'string' },
  },
  required: [
    'total',
    'perPage',
    'firstPageUrl',
    'firstPageUrl',
    'currentPage',
    'lastPage',
    'lastPageUrl',
    'previousPageUrl',
    'nextPageUrl',
  ],
}

export type VariantNameFn = (model: string, variant: string) => string

export type TransformerTypeLoaderOptions = {
  serializer: Pick<OpenAPISerializer<any>, 'serializeSchema' | 'wrap'>
  generateVariantName?: (model: string, variant: string) => string
}

export type ExtractTransformerResource<Transformer> =
  Transformer extends BaseTransformer<infer U> ? Constructor<U> : never

export type PaginationMetadataSchema<T extends Record<string, any> | undefined> = {
  type: 'object'
  properties: {
    [key in keyof T]: OpenAPIV3_1.SchemaObject
  }
  required: (keyof T)[]
}

export const TransformerTypeLoader = ({
  serializer,
}: TransformerTypeLoaderOptions): TypeLoaderFn => {
  return async (context, value) => {
    if (value instanceof Item || value instanceof Collection || value instanceof Paginator) {
      const result = await serializer.serializeSchema(context, value)
      return result
    }
  }
}

function resolveSchemaRef(context: Context, ref: string) {
  const name = ref.split('/').findLast(Boolean)!
  return context.schemas[name]
}

export async function transformAndResolve(
  context: Context,
  container: ContainerResolver<any>,
  transformer: Record<string, any>,
  variant: string,
  depth: number,
  maxDepth?: number
) {
  const input = await container.call(transformer, variant)
  return resolveValues(context, container, input, depth, maxDepth)
}

export async function resolveValues(
  context: Context,
  container: ContainerResolver<any>,
  input: ResourceData,
  depth: number,
  maxDepth?: number
) {
  const promises: Promise<[string, any]>[] = []
  const output: JSONDataTypes = {}

  for (const [key, value] of Object.entries(input)) {
    if (value instanceof Item || value instanceof Collection || value instanceof Paginator) {
      if (maxDepth && maxDepth !== -1 && depth >= maxDepth) {
        continue
      } else {
        promises.push(
          value
            .resolveSchema(context, container, maxDepth === -1 ? depth : depth + 1, maxDepth)
            .then((result: any) => [key, result])
        )
      }
    } else {
      output[key] = value as JSONDataTypes
    }
  }

  const resolvedPromises = await Promise.all(promises)

  for (const [key, value] of resolvedPromises) {
    output[key] = value
  }

  return output
}

export abstract class OpenAPISerializer<
  Wrappers extends {
    Wrap?: string
    PaginationMetaData?: Record<string, any>
  } = {},
> extends BaseSerializer<Wrappers> {
  #wrapSchema(value: any, wrapper: string | undefined, metadata?: any) {
    if (!wrapper) return value
    return {
      type: 'object',
      properties: {
        [wrapper]: value,
        ...(metadata
          ? {
              metadata,
            }
          : {}),
      },
      required: metadata ? [wrapper, 'metadata'] : [wrapper],
    }
  }

  abstract definePaginationMetaDataSchema(): PaginationMetadataSchema<
    Wrappers['PaginationMetaData']
  >

  async serializeSchema(
    context: Context,
    data:
      | Record<string, ResourceDataTypes>
      | Item<any, any, any>
      | Collection<any, any, any>
      | Paginator<any, any, any>
  ): Promise<any> {
    const container = new Container().createResolver()

    if (data instanceof Item || data instanceof Collection) {
      return data
        .resolveSchema(context, container, 0, -1)
        .then((value) => this.#wrapSchema(value, this.wrap))
    }

    if (data instanceof Paginator) {
      const wrapperKey = this.wrap ?? 'data'
      return data
        .resolveSchema(context, container, 0, -1)
        .then((value) => this.#wrapSchema(value, wrapperKey, this.definePaginationMetaDataSchema()))
    }
  }
}

async function getSchemaRef(context: Context, value: any): Promise<string | undefined> {
  if (typeof value === 'function') {
    const schema = await loadType(context, { type: value })
    if (schema && '$ref' in schema) return schema.$ref
  }

  if (typeof value === 'object') {
    if ('$ref' in value) return value.$ref
    if ('items' in value && '$ref' in value.items) return value.items.$ref
  }
}

export async function generateSchemaName(ref: string, variant: string) {
  const name = ref.split('/').findLast(Boolean)

  const suffix = stringHelpers
    .create(variant)
    .removePrefix('to')
    .removePrefix('for')
    .pascalCase()
    .toString()

  return `${name}${suffix}`
}

BaseTransformer.schema = function <Self extends { new (...args: any[]): any }>(
  this: Self,
  model:
    | ExtractTransformerResource<InstanceType<Self>>
    | [ExtractTransformerResource<InstanceType<Self>>],
  paginated: boolean = false
) {
  if (paginated) {
    const data = Array.isArray(model) ? model : [model]
    return new Paginator(
      new Collection([data, []], this, 1, 'toObject', new RuntimeException()),
      {}
    )
  }

  if (Array.isArray(model)) {
    return new Collection([model, []], this, 1, 'toObject', new RuntimeException())
  }

  return new Item([model, []], this, 1, 'toObject', new RuntimeException())
}

async function resolveSchema(
  context: Context,
  container: ContainerResolver<any>,
  transformer: {
    new (...args: any[]): Record<string, any>
  },
  resource: any,
  variant: string,
  depth: number,
  maxDepth: number,
  rest: any[]
) {
  const rootRef = await getSchemaRef(context, resource)

  if (!rootRef) {
    throw new RuntimeException(
      `Could not resolve OpenAPI schema component reference for '${inspect(resource)}'`
    )
  }

  const schemaName = await generateSchemaName(rootRef, variant)
  const schemaRef = `#/components/schemas/${schemaName}`

  const existing = context.schemas[schemaName]

  if (!existing) {
    const schema = resolveSchemaRef(context, rootRef)

    if (!schema) {
      throw new RuntimeException(`Could not resolve OpenAPI schema from '${inspect(resource)}'`)
    }

    const properties = (await transformAndResolve(
      context,
      container,
      new transformer(schema?.properties ?? {}, ...rest),
      variant,
      depth,
      maxDepth
    )) as Record<string, any>

    const required = schema.required?.filter((property) =>
      Object.keys(properties).includes(property)
    )

    const result = {
      ...schema,
      properties,
      required,
    } as OpenAPIV3.SchemaObject

    context.schemas[schemaName] = result
  }

  return { $ref: schemaRef }
}

Item.prototype.resolveSchema = async function (this, context, container, depth, maxDepth) {
  const [resource, rest] = this.transformerData

  const isArray = 'type' in resource && resource.type === 'array'

  const rootRef = await getSchemaRef(context, resource)

  if (!rootRef) {
    throw new RuntimeException(
      `Could not resolve OpenAPI schema component reference for '${inspect(resource)}'`
    )
  }

  const resolved = await resolveSchema(
    context,
    container,
    this.transformer,
    resource,
    this.variant,
    depth,
    maxDepth === -1 ? undefined : (maxDepth ?? this.maxDepth),
    rest
  )

  return isArray ? { type: 'array', items: resolved } : resolved
}

Collection.prototype.resolveSchema = async function (this, context, container, depth, maxDepth) {
  const [resources, rest] = this.transformerData
  const [resource] = resources

  const rootRef = await getSchemaRef(context, resource)

  if (!rootRef) {
    throw new RuntimeException(
      `Could not resolve OpenAPI schema component reference for '${inspect(resource)}'`
    )
  }

  const resolved = await resolveSchema(
    context,
    container,
    this.transformer,
    resource,
    this.variant,
    depth,
    maxDepth === -1 ? undefined : (maxDepth ?? this.maxDepth),
    rest
  )

  return { type: 'array', items: resolved }
}

Paginator.prototype.resolveSchema = async function (this, context, container, depth, maxDepth) {
  return this.collection.resolveSchema(context, container, depth, maxDepth)
}
