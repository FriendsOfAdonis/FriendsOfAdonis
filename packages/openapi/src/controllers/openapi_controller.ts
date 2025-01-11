import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class OpenAPIController {
  async handle({ request }: HttpContext) {
    const openapi = await app.container.make('openapi')

    const content = request.accepts(['json', 'html'])

    if (content === 'html') {
      return openapi.generateUi(request.url())
    }

    const document = await openapi.buildDocument()
    return document
  }
}
