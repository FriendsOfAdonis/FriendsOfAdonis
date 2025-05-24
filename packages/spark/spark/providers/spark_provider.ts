import { ApplicationService } from '@adonisjs/core/types'
import { SparkManager } from '../src/spark_manager.js'
import { SparkConfig } from '../src/types.js'
import { PowercordServer } from '@foadonis/powercord'
import { HttpContext } from '@adonisjs/core/http'
import { SparkInstance } from '../src/spark_instance.js'

export default class SparkProvider {
  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton(SparkManager, async (container) => {
      const config = this.app.config.get<SparkConfig>('spark')
      const logger = await container.make('logger')
      const powercord = await container.make(PowercordServer)
      const router = await container.make('router')

      return new SparkManager(
        powercord,
        router,
        {
          resolve: (constructor) => container.make(constructor),
        },
        logger,
        config
      )
    })

    this.app.container.alias('spark', SparkManager)
  }

  async boot() {
    const spark = await this.app.container.make('spark')
    HttpContext.getter('spark', function (this: HttpContext) {
      const id = this.request.header('x-powercord-id')
      if (!id) return
      return spark.getInstance(id)
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
    spark: SparkInstance | undefined
  }
}
