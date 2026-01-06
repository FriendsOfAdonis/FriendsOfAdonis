/// <reference types="hot-hook/import-meta" />

import {
  type GraphQLDriverContract,
  type PubSubContract,
  type PubSubPublishArgsByKey,
  type GraphQLOptions,
} from './types.js'
import { type HttpContext } from '@adonisjs/core/http'
import { buildSchema, type NonEmptyArray } from 'type-graphql'
import {
  type ContainerBindings,
  type HttpRouterService,
  type HttpServerService,
} from '@adonisjs/core/types'
import { type ContainerResolver } from '@adonisjs/core/container'
import { type Logger } from '@adonisjs/core/logger'
import { authChecker } from './auth_checker.js'
import { DateTime } from 'luxon'
import { LuxonDateTimeScalar } from './scalars/luxon_datetime.js'
import { type GraphQLSchema } from 'graphql'
import { UnavailableFeatureError } from './errors/unavailable_feature.js'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { type Disposable } from 'graphql-ws'
import { isHotHookMessage } from './utils/hmr.ts'
import { type LazyImport } from '@adonisjs/core/types/common'

export default class GraphQLServer<Events = PubSubPublishArgsByKey> {
  #resolvers: LazyImport<Function>[] = []

  #container: ContainerResolver<ContainerBindings>
  #config: GraphQLOptions
  #logger: Logger
  #httpServer: HttpServerService
  #pubSub?: PubSubContract<Events>
  #ws?: WebSocketServer
  #disposable?: Disposable
  #driver: GraphQLDriverContract

  constructor(
    config: GraphQLOptions,
    container: ContainerResolver<ContainerBindings>,
    httpServer: HttpServerService,
    logger: Logger
  ) {
    this.#config = config
    this.#driver = config.driver
    this.#pubSub = config.pubSub
    this.#container = container
    this.#httpServer = httpServer
    this.#logger = logger
  }

  /**
   * Registers resolvers to the GraphQL server.
   *
   * @example
   *
   * graphql.resolvers([
   *  () => import('#graphql/resolvers/user_resolver')
   *  () => import('#graphql/resolvers/recipe_resolver')
   * ])
   */
  resolvers(resolvers: LazyImport<Function>[]) {
    this.#resolvers.push(...resolvers)
  }

  /**
   * Starts listening to hot-hook to reload server
   * when files are changed.
   *
   * @param path - absolute path to the directory to watch
   */
  hmr(path: string) {
    process.on('message', (message) => {
      if (!isHotHookMessage(message)) return

      if (message.type === 'hot-hook:file-changed') {
        if (message.path.startsWith(path)) {
          this.reload()
        }
      }
    })
  }

  /**
   * Starts the GraphQL server.
   * When configured, also starts the PubSub and websocket server.
   */
  async start() {
    const schema = await this.#buildSchema()

    await Promise.all([
      this.#driver.start(schema),
      this.#pubSub?.start(),
      this.#startWebsocket(schema),
    ])

    this.#logger.info(`started GraphQL server on path ${this.#config.path}`)
  }

  /**
   * Reloads the GraphQL server.
   * The schema is rebuilt to reload the resolvers.
   *
   * Used internally for reloading the server when a resolver
   * has been invalidated by HMR.
   */
  async reload() {
    if (!this.#driver.isReady) {
      return
    }

    const schema = await this.#buildSchema()
    await this.#driver.reload(schema)
  }

  /**
   * Stops the GraphQL server.
   * When configured, also stops the PubSub and websocket server.
   */
  async stop() {
    await Promise.all([this.#driver.stop(), this.#pubSub?.stop(), this.#disposable?.dispose()])
    this.#ws?.close()
  }

  /**
   * Retrieves the configured PubSub.
   *
   * @throws {UnavailableFeatureError} - no PubSub is configured
   */
  get pubSub() {
    if (!this.#pubSub)
      throw new UnavailableFeatureError(
        "You must configure a PubSub inside 'config/graphql.ts' to use subscriptions"
      )
    return this.#pubSub
  }

  /**
   * Retrieves the GraphQL driver.
   */
  get driver() {
    return this.#driver
  }

  async #loadResolvers() {
    const resolvers = []
    for (const config of this.#resolvers.values()) {
      const { default: Resolver } = await config()
      resolvers.push(Resolver)
    }

    return resolvers
  }

  async #buildSchema(): Promise<GraphQLSchema> {
    const { scalarsMap, ...buildSchemaOptions } = this.#config

    const resolvers = await this.#loadResolvers()

    return buildSchema({
      resolvers: resolvers as NonEmptyArray<Function>,
      container: {
        get: async (someClass, data) => {
          try {
            const result = await this.#container.make(someClass)
            return result
          } catch (e) {
            console.log(someClass)
            console.error(e)
            throw e
          }
        },
      },
      scalarsMap: [{ type: DateTime, scalar: LuxonDateTimeScalar }, ...(scalarsMap ?? [])],
      authChecker: authChecker,
      pubSub: this.#pubSub,
      ...buildSchemaOptions,
    })
  }

  async #startWebsocket(schema: GraphQLSchema) {
    // We do not start the websocket server if pubsub is not configured
    if (!this.#pubSub) {
      return
    }

    const http = this.#httpServer.getNodeServer()
    if (!http) {
      return
    }

    this.#ws = new WebSocketServer({
      path: '/graphql',
      server: http,
    })

    this.#disposable = useServer(
      {
        schema,
        ...(this.#config.ws ?? {}),
      },
      this.#ws
    )
  }

  async handle(ctx: HttpContext) {
    if ('auth' in ctx) {
      await (ctx.auth as any).check()
    }

    return this.#driver.handle(ctx)
  }

  /**
   * Registers the `/graphql` route.
   */
  registerRoute(router: HttpRouterService) {
    return router
      .route(this.#config.path, ['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS'], (ctx) =>
        this.handle(ctx)
      )
      .as('graphql')
  }
}
