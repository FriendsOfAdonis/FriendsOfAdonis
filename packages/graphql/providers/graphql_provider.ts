import { type ApplicationService } from '@adonisjs/core/types'
import GraphQlServer from '../src/server.js'
import type { GraphQlService } from '../src/types.js'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { configProvider } from '@adonisjs/core'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    graphql: GraphQlService
  }
}

export default class GraphQlProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(GraphQlServer, async (resolver) => {
      const logger = await this.app.container.make('logger')
      const graphqlConfigProvider = this.app.config.get('graphql', {})
      const config = await configProvider.resolve<any>(this.app, graphqlConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/graphql.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new GraphQlServer(config, resolver, logger)
    })

    this.app.container.alias('graphql', GraphQlServer)
  }

  async ready() {
    if (this.app.getEnvironment() === 'web') {
      const graphql = await this.app.container.make('graphql')
      await graphql.start()
    }
  }

  async shutdown() {
    if (this.app.getEnvironment() === 'web') {
      const graphql = await this.app.container.make('graphql')
      await graphql.stop()
    }
  }
}

