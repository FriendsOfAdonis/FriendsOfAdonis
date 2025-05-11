import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import spark from '../services/main.js'
import { Readable } from 'node:stream'
import { isJSXElement } from './jsx/render/jsx_element.js'

export default class SparkMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    await next()

    if (response.hasContent && response.content?.length) {
      const content = response.content[0]

      if (isJSXElement(content)) {
        const layout = await spark.config.layout().then((m) => m.default)

        const readable = spark.createRenderer().layout(layout).render(content).toReadableStream()
        const stream = Readable.fromWeb(readable)

        // @adonisjs/http-server renders first check for body content
        response.lazyBody.content = undefined

        response.status(200).stream(stream)
      }
    }
  }
}
