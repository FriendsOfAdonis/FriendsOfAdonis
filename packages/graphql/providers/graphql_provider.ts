import { ApplicationService } from '@adonisjs/core/types'
import type GraphQlServer from '../src/server.js'
import { GraphQLConfig } from '../src/types.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    graphql: GraphQlServer
  }
}

export default class GraphQlProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('graphql', async (resolver) => {
      const { default: GraphQlServerClass } = await import('../src/server.js')

      const config = this.app.config.get<GraphQLConfig>('graphql', {})
      const logger = await this.app.container.make('logger')
      return new GraphQlServerClass(config, resolver, logger)
    })
  }

  async boot() {
    const graphql = await this.app.container.make('graphql')
    const router = await this.app.container.make('router')
    graphql.registerRoute(router)
  }

  async ready() {
    if (this.app.getEnvironment() === 'web') {
      const server = await this.app.container.make('server')

      const graphql = await this.app.container.make('graphql')
      await graphql.start(server.getNodeServer()!)
    }
  }
}
