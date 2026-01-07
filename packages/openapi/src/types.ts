import { type generateDocument } from 'openapi-metadata'

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
   *
   * @see https://openapi-ts.pages.dev/openapi-metadata/type-loader
   */
  loaders?: GenerateDocumentParameters['loaders']
}
