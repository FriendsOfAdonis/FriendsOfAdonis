import { GraphQLConfig, GraphQLDriverContract } from './types.js'
import { HttpContext } from '@adonisjs/core/http'
import { buildSchema } from 'type-graphql'
import { ContainerBindings, HttpRouterService } from '@adonisjs/core/types'
import { ContainerResolver } from '@adonisjs/core/container'
import { Logger } from '@adonisjs/core/logger'
import { authChecker } from './auth_checker.js'
import { DateTime } from 'luxon'
import { LuxonDateTimeScalar } from './scalars/luxon_datetime.js'
import { GraphQLSchema } from 'graphql'

export default class GraphQLServer {
  resolvers = new Map<string, Function>()

  #container: ContainerResolver<ContainerBindings>
  #config: GraphQLConfig
  #logger: Logger

  driver: GraphQLDriverContract

  constructor(
    config: GraphQLConfig & { driver: GraphQLDriverContract },
    container: ContainerResolver<ContainerBindings>,
    logger: Logger
  ) {
    this.#config = config
    this.driver = config.driver
    this.#container = container
    this.#logger = logger
  }

  async resolver(path: string, resolver: Function) {
    this.resolvers.set(path, resolver)
  }

  async start() {
    const schema = await this.#buildSchema()
    await this.driver.start(schema)
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

  async #buildSchema(): Promise<GraphQLSchema> {
    const { scalarsMap, ...buildSchemaOptions } = this.#config

    return buildSchema({
      resolvers: [...this.resolvers.values()] as any,
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
