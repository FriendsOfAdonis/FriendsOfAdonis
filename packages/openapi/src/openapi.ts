import { Route } from '@adonisjs/core/http'
import { OpenAPIConfig } from './types.js'
import { HttpRouterService } from '@adonisjs/core/types'
import { generateDocument, OpenAPIDocument } from 'openapi-metadata'
import { RouterLoader } from './loader.js'
import { Logger } from '@adonisjs/core/logger'
import { LuxonTypeLoader } from './loaders/luxon.js'
import { VineTypeLoader } from './loaders/vine.js'
import { generateRapidocUI, generateScalarUI, generateSwaggerUI } from 'openapi-metadata/ui'

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
   */
  generateUi(): string {
    const ui = this.#config.ui
    switch (ui) {
      case 'scalar':
        return generateScalarUI('/api')
      case 'swagger':
        return generateSwaggerUI('/api')
      case 'rapidoc':
        return generateRapidocUI('/api')
    }
  }

  /**
   * Registers Json, Yaml and UI OpenAPI routes.
   *
   * - /api
   * - /api.json
   * - /api.yaml
   */
  registerRoutes(routeHandlerModifier?: (route: Route) => void) {
    const route = this.#router.get('/api', [OpenAPIController])

    if (routeHandlerModifier) {
      routeHandlerModifier(route)
    }
  }
}
