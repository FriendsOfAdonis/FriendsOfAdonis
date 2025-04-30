import { ApplicationService } from '@adonisjs/core/types'
import { OsmosManager } from '../src/osmos_manager.js'

export default class OsmosProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton('osmos', () => {
      return new OsmosManager()
    })
  }

  async boot() {
    const router = await this.app.container.make('router')
    const OsmosController = () => import('../src/controllers/osmos_controller.js')

    router
      .group(() => {
        router.post('/update', [OsmosController, 'update']).as('update')
      })
      .prefix('/_osmos')
      .as('osmos')
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    osmos: OsmosManager
  }
}
