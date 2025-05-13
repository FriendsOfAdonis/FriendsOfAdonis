import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { HttpContext } from '@adonisjs/core/http'
import { SparkManager } from '../src/spark_manager.js'
import { AppFactory } from '@adonisjs/core/factories/app'
import { ApplicationService } from '@adonisjs/core/types'

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

    return new SparkManager(
      {
        resolve: async (c) => app.container.make(c),
      },
      {
        layout: null as any,
      }
    )
  }
}
