import { Logger } from '@adonisjs/core/logger'
import { HttpRouterService } from '@adonisjs/core/types'
import { RouteJSON } from '@adonisjs/core/types/http'
import { OperationMetadataStorage } from 'openapi-metadata/metadata'
import { isConstructor } from './utils.js'
import { OpenAPIConfig } from './types.js'
import stringHelpers from '@adonisjs/core/helpers/string'

export class RouterLoader {
  #router: HttpRouterService
  #logger: Logger
  #config: OpenAPIConfig

  constructor(config: OpenAPIConfig, router: HttpRouterService, logger: Logger) {
    this.#router = router
    this.#logger = logger
    this.#config = config
  }

  async importRouterController(route: RouteJSON): Promise<[Function, string] | undefined> {
    const handler = route.handler
    if (typeof handler === 'function') return

    const reference = handler.reference
    if (typeof reference === 'string') {
      this.#logger.warn('Magic strings controllers are not supported yet')
      return
    }

    let construct = reference[0] as Function
    const propertyKey = reference[1] ?? 'handle'

    if (propertyKey === 'handle') return

    // For lazy imports
    if (!isConstructor(construct)) {
      construct = await construct().then((m: any) => m.default)
    }

    return [construct, propertyKey]
  }

  async loadRouteController(route: RouteJSON): Promise<Function | undefined> {
    const reference = await this.importRouterController(route)
    if (!reference) return

    const [target, propertyKey] = reference

    const name = stringHelpers.create(target.name).removeSuffix('Controller').toString()

    OperationMetadataStorage.defineMetadata(
      target.prototype,
      {
        path: route.pattern,
        methods: route.methods.filter((m) => m !== 'HEAD').map((r) => r.toLowerCase()) as any,
        tags: (this.#config.generateTags === undefined || this.#config.generateTags) ? [name] : [],
      },
      propertyKey
    )

    return target
  }

  async load(): Promise<Function[]> {
    const routerJson = this.#router.toJSON()

    const controllers = new Set<Function>()

    for (const routes of Object.values(routerJson)) {
      for (const route of routes) {
        const controller = await this.loadRouteController(route)
        if (!controller) continue
        controllers.add(controller)
      }
    }

    return [...controllers]
  }
}
