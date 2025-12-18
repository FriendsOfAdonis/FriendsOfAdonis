import {
  GraphQLConfig,
  GraphQLDriverContract,
  PubSubContract,
  PubSubPublishArgsByKey,
} from './types.js'
import { HttpContext } from '@adonisjs/core/http'
import { buildSchema } from 'type-graphql'
import { ContainerBindings, HttpRouterService, HttpServerService } from '@adonisjs/core/types'
import { ContainerResolver } from '@adonisjs/core/container'
import { Logger } from '@adonisjs/core/logger'
import { authChecker } from './auth_checker.js'
import { DateTime } from 'luxon'
import { LuxonDateTimeScalar } from './scalars/luxon_datetime.js'
import { GraphQLSchema } from 'graphql'
import { UnavailableFeatureError } from './errors/unavailable_feature.js'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { Disposable } from 'graphql-ws'

export default class GraphQLServer<Events = PubSubPublishArgsByKey> {
  resolvers = new Map<string, Function>()

  #container: ContainerResolver<ContainerBindings>
  #config: GraphQLConfig
  #logger: Logger
  #httpServer: HttpServerService
  #pubSub?: PubSubContract<Events>
  #ws?: WebSocketServer
  #disposable?: Disposable

  driver: GraphQLDriverContract

  constructor(
    config: GraphQLConfig & { driver: GraphQLDriverContract; pubSub?: PubSubContract<Events> },
    container: ContainerResolver<ContainerBindings>,
    httpServer: HttpServerService,
    logger: Logger
  ) {
    this.#config = config
    this.driver = config.driver
    this.#pubSub = config.pubSub
    this.#container = container
    this.#httpServer = httpServer
    this.#logger = logger
  }

  async resolver(path: string, resolver: Function) {
    this.resolvers.set(path, resolver)
  }

  async start() {
    const schema = await this.#buildSchema()

    await Promise.all([
      this.driver.start(schema),
      this.#pubSub?.start(),
      this.#startWebsocket(schema),
    ])

    this.#logger.info(`started GraphQL server on path ${this.#config.path}`)
  }

  async reload() {
    // Driver has not been started yet
    if (!this.driver.isReady) {
      return
    }

    const schema = await this.#buildSchema()
    await this.driver.reload(schema)
  }

  async stop() {
    await Promise.all([this.driver.stop(), this.#pubSub?.stop(), this.#disposable?.dispose()])
    this.#ws?.close()
  }

  get pubSub() {
    if (!this.#pubSub)
      throw new UnavailableFeatureError(
        "You must configure a PubSub inside 'config/graphql.ts' to use subscriptions"
      )
    return this.#pubSub
  }

  async #buildSchema(): Promise<GraphQLSchema> {
    const { scalarsMap, ...buildSchemaOptions } = this.#config

    return buildSchema({
      resolvers: [...this.resolvers.values()] as any,
      container: {
        get: async (someClass) => {
          return this.#container.make(someClass)
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

    return this.driver.handle(ctx)
  }

  registerRoute(router: HttpRouterService) {
    router.route(this.#config.path, ['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS'], (ctx) =>
      this.handle(ctx)
    )
  }
}
