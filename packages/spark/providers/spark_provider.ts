import { ApplicationService } from '@adonisjs/core/types'
import { SparkManager } from '../src/spark_manager.js'
import { SparkConfig } from '../src/types.js'
import { HttpContext } from '@adonisjs/core/http'
import { Application } from '@adonisjs/core/app'

export default class SparkProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton('spark', () => {
      const config = this.app.config.get<SparkConfig>('spark')
      return new SparkManager(config)
    })
  }

  async boot() {
    const spark = await this.app.container.make('spark')
    const router = await this.app.container.make('router')
    const SparkController = () => import('../src/controllers/spark_controller.js')

    router
      .group(() => {
        router.post('/update', [SparkController, 'update']).as('update')
      })
      .prefix('/_spark')
      .as('spark')

    HttpContext.getter(
      'spark',
      function (this: HttpContext) {
        return spark.createRenderer()
      },
      true
    )

    Application.macro('sparkPath', function (this: Application<any>, ...paths: string[]) {
      return this.makePath('app/spark', ...paths)
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    spark: SparkManager
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    spark: ReturnType<SparkManager['createRenderer']>
  }
}

declare module '@adonisjs/core/app' {
  interface Application<ContainerBindings extends Record<any, any>> {
    sparkPath: (...paths: string[]) => string
  }
}
