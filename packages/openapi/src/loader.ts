import { type Logger } from '@adonisjs/core/logger'
import { type HttpRouterService } from '@adonisjs/core/types'
import { type RouteJSON } from '@adonisjs/core/types/http'
import {
  ExcludeMetadataStorage,
  OperationMetadataStorage,
  OperationParameterMetadataStorage,
} from '@martin.xyz/openapi-decorators/metadata'
import { isConstructor, toOpenAPIPath } from './utils.js'
import { type OperationTaggerFn } from './types.js'

export class RouterLoader {
  #router: HttpRouterService
  #logger: Logger
  #tagger: OperationTaggerFn

  constructor(router: HttpRouterService, logger: Logger, tagger: OperationTaggerFn) {
    this.#router = router
    this.#logger = logger
    this.#tagger = tagger
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

    // We must manually check for metadata
    if (ExcludeMetadataStorage.getMetadata(target) === true) return target

    const tags = this.#tagger(route, target, propertyKey)

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

    // The metadata registry lives for the whole process and is re-scanned on every
    // `buildDocument()` call outside production, so rebuild the path parameters from the current
    // route instead of appending to them. Keep the parameters the route still declares (and any
    // user-defined `@ApiParam`), drop the renamed/removed ones, then add whatever is missing — so
    // re-scans stay idempotent and a changed route is always reflected.
    const existingParams = OperationParameterMetadataStorage.getMetadata(
      target.prototype,
      propertyKey
    )
    const current = new Set(params)

    const kept = existingParams.filter((p) => p.in !== 'path' || current.has(p.name))
    const present = new Set(kept.filter((p) => p.in === 'path').map((p) => p.name))
    const added = params
      .filter((name) => !present.has(name))
      .map((name) => ({ in: 'path', type: 'string', name, required: true }) as const)

    OperationParameterMetadataStorage.defineMetadata(
      target.prototype,
      [...kept, ...added],
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
