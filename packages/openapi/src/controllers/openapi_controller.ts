import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class OpenAPIController {
  async handle({ request }: HttpContext) {
    const openapi = await app.container.make('openapi')

    const extension = request.url().split('.').pop() as 'json' | 'yaml'

    switch (extension) {
      case 'json':
        return openapi.buildDocument()
      case 'yaml':
        return openapi.buildDocument()
      default:
        return openapi.generateUi(request.url())
    }
  }
}
