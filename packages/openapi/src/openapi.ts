import { type OpenAPIConfig, type OpenAPIDocumentConfig } from './types.js'
import { type HttpRouterService } from '@adonisjs/core/types'
import { generateDocument } from '@martin.xyz/openapi-decorators'
import { RouterLoader } from './router_loader.ts'
import { type Logger } from '@adonisjs/core/logger'
import { LuxonTypeLoader } from './loaders/luxon.js'
import {
  generateRapidocUI,
  generateScalarUI,
  generateSwaggerUI,
} from '@martin.xyz/openapi-decorators/ui'
import { type OpenAPIDocument } from '@martin.xyz/openapi-decorators/types'
import { type Constructor, type LazyImport } from '@adonisjs/core/types/common'
import { type BaseOpenAPIController } from './controllers/base_openapi_controller.ts'

export class OpenAPI<Documents extends Record<string, OpenAPIDocumentConfig>> {
  #router: HttpRouterService
  #logger: Logger
  #config: OpenAPIConfig<Documents>

  #documents = new Map<keyof Documents, OpenAPIDocument>()

  constructor(config: OpenAPIConfig<Documents>, router: HttpRouterService, logger: Logger) {
    this.#router = router
    this.#logger = logger
    this.#config = config
  }

  /**
   * Retrieves an OpenAPI Document.
   * The document is built if it does not exist.
   *
   * @param document - The document name as configured in `config/openapi.ts`
   * @param force - Force re-generating the document
   *
   * @returns The generated OpenAPI document
   */
  async document(document: keyof Documents, force = false) {
    if (!force) {
      const existing = this.#documents.get(document)
      if (existing) return existing
    }

    const config = this.#config.docs[document]
    const loader = new RouterLoader(this.#router, {
      logger: this.#logger,
      tagger: config.tagger,
      filter: config.filter,
    })

    const controllers = await loader.load()
    const customTypeLoaders = this.#config.loaders ?? []

    const output = await generateDocument({
      controllers: [...controllers, ...(config.controllers ?? [])],
      customLogger: this.#logger,
      document: config.document,
      loaders: [...customTypeLoaders, LuxonTypeLoader],
    })

    this.#documents.set(document, output)

    return output
  }

  /**
   * Generates the HTML to display the OpenAPI documentation UI.
   *
   * @param ui - Documentation UI to generate
   * @param path - Path or url to the api documentation
   *
   * @returns The html content for displaying the documentation UI
   */
  ui(ui: 'scalar' | 'swagger' | 'rapidoc', path: string): string {
    switch (ui) {
      case 'scalar':
        return generateScalarUI(path)
      case 'swagger':
        return generateSwaggerUI(path)
      case 'rapidoc':
        return generateRapidocUI(path)
    }
  }

  /**
   * Registers the routes for serving the OpenAPI documentation.
   *
   * @param pattern - The route pattern
   * @param Controller - The lazy-import of the OpenAPI controller
   *
   * @returns - The group containing the routes
   *
   * @example
   * ```ts
   * openapi.registerController('/api/v1', controllers.OpenApi)
   * ```
   */
  registerController(pattern: string, Controller: LazyImport<Constructor<BaseOpenAPIController>>) {
    const group = this.#router
      .group(() => {
        this.#router.get(pattern, [Controller, 'html']).as('html')
        this.#router.get(`${pattern}.json`, [Controller, 'json']).as('json')
        this.#router.get(`${pattern}.yaml`, [Controller, 'yaml']).as('yaml')
      })
      .as('openapi')

    return group
  }
}
