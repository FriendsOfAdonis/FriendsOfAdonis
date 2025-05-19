import { HttpRouterService } from '@adonisjs/core/types'
import { RoutesManager } from './routes_manager.js'
import { ResourcesManager } from './resources/manager.js'
import { ResolvedConfig } from './types.js'

export class CockpitManager {
  #routes: RoutesManager

  resources: ResourcesManager

  config: ResolvedConfig

  constructor(config: ResolvedConfig, router: HttpRouterService) {
    this.#routes = new RoutesManager(router)
    this.resources = new ResourcesManager({
      autoload: config.resources.autoload,
    })

    this.config = config
  }

  async boot() {
    await this.resources.boot()
    this.#routes.registerRoutes()
  }
}
