import { ApplicationService } from '@adonisjs/core/types'
import GraphQlServer from '../src/server.js'
import type { GraphQlService } from '../src/types.js'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { configProvider } from '@adonisjs/core'
import { Autoloader } from '@foadonis/autoloader'

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
      const server = await this.app.container.make('server')

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/graphql.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new GraphQlServer(config, resolver, server, logger)
    })

    this.app.container.alias('graphql', GraphQlServer)
  }

  async autoloadResolvers(graphql: GraphQlServer, path: string) {
    const autoloader = new Autoloader({
      path: new URL(path, this.app.appRoot),
      glob: '**/*_resolver.(js|ts|jsx|tsx)',
    })

    for await (const [modulePath, module] of autoloader.autoload()) {
      graphql.resolvers.set(modulePath, module.default)
    }

    autoloader.hooks.add('loaded', async (modulePath, module) => {
      graphql.resolvers.set(modulePath, module.default)
      await graphql.reload()
    })

    autoloader.hooks.remove('unlink', async (modulePath) => {
      graphql.resolvers.delete(modulePath)
      await graphql.reload()
    })

    if (this.app.getEnvironment() === 'web' && this.app.inDev) {
      await autoloader.watch()
    }
  }

  async boot() {
    const graphql = await this.app.container.make('graphql')
    const router = await this.app.container.make('router')

    graphql.registerRoute(router)

    const directory = this.app.rcFile.directories.resolvers
    if (directory) {
      await this.autoloadResolvers(graphql, directory)
    }
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
