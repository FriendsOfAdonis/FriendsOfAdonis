import { type RouteJSON } from '@adonisjs/core/types/http'
import { type Context, type generateDocument } from '@martin.xyz/openapi-decorators'
import { type ExtractTransformerResource } from './loaders/transformer.ts'
import { type Next } from '@adonisjs/core/types/transformers'
import { type ContainerResolver } from '@adonisjs/core/container'
import { type OpenAPIV3_1 } from 'openapi-types'

type GenerateDocumentParameters = Parameters<typeof generateDocument>[0]

export type OpenAPIConfig = {
  /**
   * Base OpenAPI document.
   * It gets deeply merged into the generated OpenAPI document
   * allowing you to extend the final document.
   */
  document: GenerateDocumentParameters['document']

  /**
   * User interface integration to use.
   */
  ui: 'scalar' | 'swagger' | 'rapidoc'

  /**
   * Additional controllers to load into your schema.
   */
  controllers?: GenerateDocumentParameters['controllers']

  /**
   * Custom type loaders.
   */
  loaders?: GenerateDocumentParameters['loaders']

  /**
   * Customize controllers auto-tagging.
   *
   * @example
   * (_route, target) => [stringHelpers.create(target.name).removeSuffix('Controller').toString()]
   */
  tagger?: OperationTaggerFn
}

export type OperationTaggerFn = (
  route: RouteJSON,
  target: Function,
  propertyKey: string
) => string[]

declare module '@adonisjs/core/transformers' {
  namespace BaseTransformer {
    function schema<Self extends { new (resource: any, ...rest: any[]): any }>(
      this: Self,
      model:
        | ExtractTransformerResource<InstanceType<Self>>
        | [ExtractTransformerResource<InstanceType<Self>>],
      paginated?: boolean
    ):
      | Item<InstanceType<Self>, 1, 'toObject'>
      | Collection<InstanceType<Self>, 1, 'toObject'>
      | Paginator<InstanceType<Self>, 1, 'toObject'>
  }

  interface Item<
    Transformer extends Record<string, any>,
    MaxDepth extends Next[number],
    Variant extends string,
  > {
    resolveSchema(
      context: Context,
      container: ContainerResolver<any>,
      depth: number,
      maxDepth?: number
    ): Promise<OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject>
  }

  interface Collection<
    Transformer extends Record<string, any>,
    MaxDepth extends Next[number],
    Variant extends string,
  > {
    context: Context
    resolveSchema(
      context: Context,
      container: ContainerResolver<any>,
      depth: number,
      maxDepth?: number
    ): Promise<OpenAPIV3_1.SchemaObject>
  }

  interface Paginator<
    Transformer extends Record<string, any>,
    MaxDepth extends Next[number],
    Variant extends string,
  > {
    context: Context
    resolveSchema(
      context: Context,
      container: ContainerResolver<any>,
      depth: number,
      maxDepth?: number
    ): Promise<OpenAPIV3_1.SchemaObject>
  }
}
