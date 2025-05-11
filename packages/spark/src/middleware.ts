import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { Readable } from 'node:stream'
import { isJSXElement } from './jsx/render/jsx_element.js'
import { SparkManager } from './spark_manager.js'
import { inject } from '@adonisjs/core'

@inject()
export default class SparkMiddleware {
  constructor(private readonly spark: SparkManager) {}

  async handle({ response }: HttpContext, next: NextFn) {
    await next()

    if (response.hasContent && response.content?.length) {
      const content = response.content[0]

      if (isJSXElement(content)) {
        const layout = await this.spark.config.layout().then((m) => m.default)

        const readable = this.spark
          .createRenderer()
          .layout(layout)
          .render(content)
          .toReadableStream()

        const stream = Readable.fromWeb(readable)

        // @adonisjs/http-server renders first check for body content
        response.lazyBody.content = undefined

        response.status(200).stream(stream)
      }
    }
  }
}
