import { type Logger } from '@adonisjs/core/logger'
import { type HttpRouterService } from '@adonisjs/core/types'
import { type RouteJSON } from '@adonisjs/core/types/http'
import {
  ExcludeMetadataStorage,
  OperationMetadataStorage,
  OperationParameterMetadataStorage,
} from '@martin.xyz/openapi-decorators/metadata'
import { isConstructor, toOpenAPIPath } from './utils.ts'
import { type OperationFilterFn, type OperationTaggerFn } from './types.ts'
import stringHelpers from '@adonisjs/core/helpers/string'

export type RouterLoaderOptions = {
  logger: Logger
  tagger?: OperationTaggerFn
  filter?: OperationFilterFn
}

/**
 * The Router Loader is in charge of auto-loading controllers and routes
 * from the HTTP Router.
 *
 * It automatically inject API metadata about endpoints.
 */
export class RouterLoader {
  #router: HttpRouterService
  #logger: Logger
  #taggerFn: OperationTaggerFn
  #filterFn: OperationFilterFn

  constructor(router: HttpRouterService, options: RouterLoaderOptions) {
    this.#router = router
    this.#logger = options.logger
    this.#taggerFn =
      options.tagger ??
      ((_, target) => [stringHelpers.create(target.name).removeSuffix('Controller').toString()])
    this.#filterFn = options.filter ?? (() => true)
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

    if (this.#filterFn(route, target, propertyKey) === false) {
      return
    }

    // We must manually check for metadata
    if (ExcludeMetadataStorage.getMetadata(target) === true) return target

    const tags = this.#taggerFn(route, target, propertyKey)

    // Transform Adonis-style path parameters to OpenAPI-compliant format
    const openAPIPath = toOpenAPIPath(route.pattern)
    const params = route.tokens.filter((item) => item.type === 1).map((item) => item.val)

    const existing = OperationMetadataStorage.getMetadata(target.prototype, propertyKey, true)

    OperationMetadataStorage.defineMetadata(
      target.prototype,
      {
        ...existing,
        path: openAPIPath,
        methods: route.methods.filter((m) => m !== 'HEAD').map((r) => r.toLowerCase()) as any,
        tags: tags,
      },
      propertyKey
    )

    for (const param of params) {
      OperationParameterMetadataStorage.mergeMetadata(
        target.prototype,
        [{ in: 'path', type: 'string', name: param }],
        propertyKey
      )
    }

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
