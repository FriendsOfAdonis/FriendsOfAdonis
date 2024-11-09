import { ApolloServer } from '@apollo/server'
import { GraphQlConfig, LazyImport } from './types.js'
import { HttpContext } from '@adonisjs/core/http'
import { buildSchema } from 'type-graphql'
import { ContainerBindings } from '@adonisjs/core/types'
import { adonisToGraphqlRequest, graphqlToAdonisResponse } from './utils/apollo.js'
import { ContainerResolver } from '@adonisjs/core/container'
import { Logger } from '@adonisjs/core/logger'
import { authChecker } from './auth_checker.js'
import { DateTime } from 'luxon'
import { LuxonDateTimeScalar } from './scalars/luxon_datetime.js'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { Server } from 'node:http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { GraphQLSchema } from 'graphql'

export default class GraphQLServer {
  #resolvers: LazyImport<Function>[] = []
  #container: ContainerResolver<ContainerBindings>
  #config: GraphQlConfig
  #logger: Logger
  #apollo?: ApolloServer

  constructor(
    config: GraphQlConfig,
    container: ContainerResolver<ContainerBindings>,
    logger: Logger
  ) {
    this.#config = config
    this.#container = container
    this.#logger = logger
  }

  get apollo() {
    if (!this.#apollo) {
      throw new Error('ApolloServer has not been configured yet')
    }

    return this.#apollo
  }

  async resolvers(resolvers: LazyImport<Function>[]) {
    this.#resolvers = resolvers
  }

  async start(server: Server) {
    const schema = await this.#buildSchema()

    await this.#startApollo(schema)
    await this.#startWebsocket(schema, server)
  }

  async #buildSchema(): Promise<GraphQLSchema> {
    const resolvers = await Promise.all(this.#resolvers.map((r) => r())).then(
      (m) => m.map((r) => r.default).filter(Boolean) as Function[]
    )

    const { apollo, scalarsMap, ...buildSchemaOptions } = this.#config

    return buildSchema({
      resolvers: resolvers as any,
      container: {
        get: (someClass) => {
          return this.#container.make(someClass)
        },
      },
      scalarsMap: [{ type: DateTime, scalar: LuxonDateTimeScalar }, ...(scalarsMap ?? [])],
      authChecker: authChecker,
      ...buildSchemaOptions,
    })
  }

  async #startApollo(schema: GraphQLSchema) {
    const {
      apollo: { plugins, playground, ...apolloConfig },
    } = this.#config

    const apollo = new ApolloServer({
      schema,
      plugins: [
        ...(plugins ?? []),
        ...(!playground ? [ApolloServerPluginLandingPageDisabled()] : []),
      ],
      ...apolloConfig,
    })

    this.#apollo = apollo
    await apollo.start()

    this.#logger.info('started GraphQL Apollo Server')
  }

  async #startWebsocket(schema: GraphQLSchema, httpServer: Server) {
    // We do not start the websocket server if pubsub is not configured
    if (!this.#config.pubSub) {
      return
    }

    const ws = new WebSocketServer({
      path: '/graphql',
      server: httpServer,
    })

    useServer({ schema }, ws)
  }

  async handle(ctx: HttpContext) {
    const apollo = this.#apollo
    if (!apollo) {
      this.#logger.warn('tried to access Apollo Server when not initialized')
      return
    }

    if ('auth' in ctx) {
      await (ctx.auth as any).check()
    }

    const httpGraphQLRequest = adonisToGraphqlRequest(ctx.request)
    const httpGraphQLResponse = await apollo.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: async () => ctx,
    })

    return graphqlToAdonisResponse(ctx.response, httpGraphQLResponse)
  }
}
