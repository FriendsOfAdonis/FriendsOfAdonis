import { ApplicationService } from '@adonisjs/core/types'
import { OsmosManager } from '../src/osmos_manager.js'
import { OsmosConfig } from '../src/types.js'
import { HttpContext } from '@adonisjs/core/http'

export default class OsmosProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton('osmos', () => {
      const config = this.app.config.get<OsmosConfig>('osmos')
      return new OsmosManager(config)
    })
  }

  async boot() {
    const osmos = await this.app.container.make('osmos')
    const router = await this.app.container.make('router')
    const OsmosController = () => import('../src/controllers/osmos_controller.js')

    router
      .group(() => {
        router.post('/update', [OsmosController, 'update']).as('update')
      })
      .prefix('/_osmos')
      .as('osmos')

    HttpContext.getter(
      'osmos',
      function (this: HttpContext) {
        return osmos.createRenderer()
      },
      true
    )
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    osmos: OsmosManager
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    osmos: ReturnType<OsmosManager['createRenderer']>
  }
}
