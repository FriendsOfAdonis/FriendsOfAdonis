import { type RouteJSON } from '@adonisjs/core/types/http'
import { type generateDocument } from '@martin.xyz/openapi-decorators'

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
