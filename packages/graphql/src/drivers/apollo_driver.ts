import { HttpContext } from '@adonisjs/core/http'
import { GraphQLSchema } from 'graphql'
import { GraphQLDriverContract } from '../types.js'
import {
  ApolloServer,
  ApolloServerOptionsWithSchema,
  BaseContext,
  ContextThunk,
} from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { adonisToGraphqlRequest, graphqlToAdonisResponse } from '../utils/apollo.js'
import { Logger } from '@adonisjs/core/logger'

export type ApolloDriverConfig = Omit<ApolloServerOptionsWithSchema<BaseContext>, 'schema'> & {
  playground?: boolean
  context?: ContextThunk
}

export class ApolloDriver implements GraphQLDriverContract {
  #server?: ApolloServer<BaseContext>
  #config: ApolloDriverConfig
  #logger: Logger

  #isReady = false

  constructor(config: ApolloDriverConfig, logger: Logger) {
    this.#config = config
    this.#logger = logger
  }

  get server() {
    if (!this.#server) {
      throw new Error('ApolloServer has not been configured yet')
    }

    return this.#server
  }

  get isReady() {
    return this.#isReady
  }

  async start(schema: GraphQLSchema) {
    await this.#startApollo(schema)
    this.#isReady = true
  }

  async reload(schema: GraphQLSchema) {
    await this.server.stop()
    await this.start(schema)
  }

  async #startApollo(schema: GraphQLSchema) {
    const { plugins, playground, ...apolloConfig } = this.#config

    const apollo = new ApolloServer({
      schema,
      logger: this.#logger,
      plugins: [
        ...(plugins ?? []),
        ...(!playground ? [ApolloServerPluginLandingPageDisabled()] : []),
      ],
      ...apolloConfig,
    })

    this.#server = apollo
    await apollo.start()
  }

  async handle(ctx: HttpContext) {
    const httpGraphQLRequest = adonisToGraphqlRequest(ctx.request)

    const httpGraphQLResponse = await this.server.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: this.#config.context ?? (async () => ctx),
    })

    return graphqlToAdonisResponse(ctx.response, httpGraphQLResponse)
  }

  async stop(): Promise<void> {
    await this.#server?.stop()
  }
}
