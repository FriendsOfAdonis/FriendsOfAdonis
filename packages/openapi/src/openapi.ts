import { type OpenAPIConfig } from './types.js'
import { type HttpRouterService } from '@adonisjs/core/types'
import { generateDocument } from '@martin.xyz/openapi-decorators'
import { RouterLoader } from './loader.js'
import { type Logger } from '@adonisjs/core/logger'
import { LuxonTypeLoader } from './loaders/luxon.js'
import { VineTypeLoader } from './loaders/vine.js'
import {
  generateRapidocUI,
  generateScalarUI,
  generateSwaggerUI,
} from '@martin.xyz/openapi-decorators/ui'
import { type OpenAPIDocument } from '@martin.xyz/openapi-decorators/types'

const OpenAPIController = () => import('./controllers/openapi_controller.js')

export class OpenAPI {
  #router: HttpRouterService
  #document?: OpenAPIDocument
  #routerLoader: RouterLoader
  #logger: Logger
  #isProduction: boolean
  #config: OpenAPIConfig

  constructor(
    config: OpenAPIConfig,
    router: HttpRouterService,
    logger: Logger,
    isProduction: boolean
  ) {
    this.#router = router
    this.#logger = logger
    this.#routerLoader = new RouterLoader(router, logger)
    this.#isProduction = isProduction
    this.#config = config
  }

  /**
   * Builds the OpenAPIDocument.
   *
   * @returns OpenAPI compliant document.
   */
  async buildDocument() {
    if (this.#document && this.#isProduction) {
      return this.#document
    }

    const controllers = await this.#routerLoader.load()

    this.#document = await generateDocument({
      controllers: [...controllers, ...(this.#config.controllers ?? [])],
      customLogger: this.#logger,
      loaders: [LuxonTypeLoader, VineTypeLoader, ...(this.#config.loaders ?? [])],
      document: this.#config.document,
    })

    return this.#document
  }

  /**
   * Generates HTML do display the OpenAPI documentation UI.
   *
   * @param path - path or url to the api documentation.
   *
   * @returns the html content for displaying the documentation UI.
   */
  generateUi(path = '/api'): string {
    const ui = this.#config.ui
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
   * Registers Json, Yaml and UI OpenAPI routes.
   * - /api
   * - /api.json
   * - /api.yaml
   *
   * @param path - endpoint for accesing the specs.
   * @param routeHandlerModifier - modifier to apply middlewares, etc.
   *
   * @returns the routes group.
   *
   * @example
   * openapi.registerRoutes()
   * openapi.registerRoutes("/api", (route) => route.use(middlewares.auth()))
   */
  registerRoutes(path = '/api') {
    const group = this.#router
      .group(() => {
        this.#router.get(path, [OpenAPIController, 'html']).as('html')
        this.#router.get(`${path}.json`, [OpenAPIController, 'json']).as('json')
        this.#router.get(`${path}.yaml`, [OpenAPIController, 'yaml']).as('yaml')
      })
      .as('openapi')

    return group
  }
}
