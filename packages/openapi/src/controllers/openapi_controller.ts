import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import YAML from 'yaml'

export default class OpenAPIController {
  async html({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')

    const url = router.makeUrl('openapi.json')

    const content = openapi.generateUi(url)

    return response.status(200).header('Content-Type', 'text/html').send(content)
  }

  async yaml({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()

    const body = YAML.stringify(document)

    return response.status(200).header('Content-Type', 'application/yaml').send(body)
  }

  async json({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()

    const body = JSON.stringify(document)

    return response.status(200).header('Content-Type', 'application/json').send(body)
  }
}
