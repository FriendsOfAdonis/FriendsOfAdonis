import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { isVnode } from './runtime/render.js'
import osmos from '../services/main.js'

export default class OsmosMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    await next()

    if (response.hasContent && response.content?.length) {
      const content = response.content[0]

      if (isVnode(content)) {
        const html = await osmos.render(content)
        response.send(html)
      }
    }
  }
}
