import { Route } from '@adonisjs/core/http'
import { OpenAPIConfig } from './types.js'
import { HttpRouterService } from '@adonisjs/core/types'
import { generateDocument, OpenAPIDocument } from 'openapi-metadata'
import { RouterLoader } from './loader.js'
import { Logger } from '@adonisjs/core/logger'
import { LuxonTypeLoader } from './loaders/luxon.js'
import { VineTypeLoader } from './loaders/vine.js'

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

  registerRoutes(routeHandlerModifier?: (route: Route) => void) {
    const routes = [
      this.#router.get('/api', [OpenAPIController]),
      this.#router.get('/api.json', [OpenAPIController]),
      this.#router.get('/api.yaml', [OpenAPIController]),
    ]

    if (routeHandlerModifier) {
      for (const route of routes) {
        routeHandlerModifier(route)
      }
    }
  }
}
