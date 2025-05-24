import { HttpContextFactory, RouterFactory } from '@adonisjs/core/factories/http'
import { HttpContext } from '@adonisjs/core/http'
import { AppFactory } from '@adonisjs/core/factories/app'
import { ApplicationService } from '@adonisjs/core/types'
import { PowercordFactory } from '@foadonis/powercord/factories/powercord'
import { SparkManager } from '../src/spark_manager.js'
import { Logger } from '@adonisjs/core/logger'

type SparkFactoryParameters = {
  ctx: HttpContext
}

export class SparkFactory {
  #parameters: SparkFactoryParameters = {
    ctx: new HttpContextFactory().create(),
  }

  #getApp() {
    return new AppFactory().create(new URL('./', import.meta.url), () => {}) as ApplicationService
  }

  merge(parameters: Partial<SparkFactoryParameters>) {
    Object.assign(this.#parameters, parameters)
    return this
  }

  async create() {
    const app = this.#getApp()

    const powercord = new PowercordFactory().create().powercord
    const router = new RouterFactory().create()
    const logger = new Logger({})

    return new SparkManager(
      powercord,
      router,
      {
        resolve: async (c) => new c(),
      },
      logger,
      {} as any
    )
  }
}
