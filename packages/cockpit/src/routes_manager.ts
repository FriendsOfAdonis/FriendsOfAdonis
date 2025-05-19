import { HttpRouterService } from '@adonisjs/core/types'
import { RouteGroup } from '@adonisjs/core/http'

const CockpitController = () => import('./controllers/cockpit_controller.js')
const ResourcesController = () => import('./controllers/resources_controller.js')

export class RoutesManager {
  #router: HttpRouterService

  constructor(router: HttpRouterService) {
    this.#router = router
  }

  registerRoutes(modifier?: (group: RouteGroup) => void) {
    const route = this.#router
      .group(() => {
        this.#registerBaseRoute()
        this.#registerResourceRoutes()
      })
      .as('cockpit')
      .prefix('/admin')

    modifier?.(route)
  }

  #registerBaseRoute() {
    this.#router.get('/', [CockpitController, 'index']).as('home')
  }

  #registerResourceRoutes() {
    this.#router
      .group(() => {
        this.#router.get('/', [ResourcesController, 'index']).as('index')
        this.#router.get('/create', [ResourcesController, 'create']).as('create')
        this.#router.get('/:recordId/edit', [ResourcesController, 'edit']).as('edit')
      })
      .as('resources')
      .prefix('/resources/:resourceId')
  }
}
