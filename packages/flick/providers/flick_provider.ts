/// <reference types="@adonisjs/core/providers/edge_provider" />

import { type ApplicationService } from '@adonisjs/core/types'
import { Flick } from '../src/flick.ts'
import { FlickOptions, FlickService } from '../src/types.ts'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { edgePluginFlick } from '../src/plugins/edge.ts'

export default class FlickProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('flick', async (resolver) => {
      const flickConfigProvider = this.app.config.get('flick', {})
      const config = await configProvider.resolve<FlickOptions>(this.app, flickConfigProvider)

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/flick.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Flick(config.features, resolver, config.driver) as unknown as FlickService
    })
  }

  async boot() {
    if (!this.app.usingEdgeJS) return

    const { default: edge } = await import('edge.js')
    const flick = await this.app.container.make('flick')
    edge.use(edgePluginFlick(flick))
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    flick: FlickService
  }
}
