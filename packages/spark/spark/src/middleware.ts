import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { isJSXElement } from './jsx/render/jsx_element.js'
import { SparkManager } from './spark_manager.js'
import { inject } from '@adonisjs/core'

@inject()
export default class SparkMiddleware {
  constructor(private readonly spark: SparkManager) {}

  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    if (ctx.response.hasContent && ctx.response.content?.length) {
      const content = ctx.response.content[0]

      if (isJSXElement(content)) {
        const instance = ctx.spark ?? this.spark.createInstance()

        const layout = await this.spark.config
          .layout(ctx)()
          .then((m) => m.default)

        // TODO: Handle streaming once error handling is done properly
        const html = await this.spark
          .createRenderer(instance)
          .layout(layout)
          .render(content)
          .toString()

        // const stream = Readable.fromWeb(readable)
        //
        // // @adonisjs/http-server renders first check for body content
        // ctx.response.lazyBody.content = undefined
        //
        ctx.response.status(200).send(html)
      }
    }
  }
}
