import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { ApiOperation, ApiResponse } from 'openapi-metadata/decorators'
import YAML from 'yaml'

export default class OpenAPIController {
  @ApiOperation({
    summary: 'Documentation UI',
    description: 'Displays the OpenAPI documentation UI.',
  })
  @ApiResponse({
    description: 'The documentation UI',
    type: 'string',
    mediaType: 'text/html',
  })
  async html({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')

    const url = router.makeUrl('openapi.json')

    const content = openapi.generateUi(url)

    return response.status(200).header('Content-Type', 'text/html').send(content)
  }

  @ApiOperation({
    summary: 'JSON Documentation',
    description: 'Returns the OpenAPI documentation in JSON format.',
  })
  @ApiResponse({
    description: 'The documentation in JSON format',
    type: 'string',
    mediaType: 'application/json',
  })
  async json({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()

    const body = JSON.stringify(document)

    return response.status(200).header('Content-Type', 'application/json').send(body)
  }

  @ApiOperation({
    summary: 'YAML Documentation',
    description: 'Returns the OpenAPI documentation in YAML format.',
  })
  @ApiResponse({
    description: 'The documentation in YAML format',
    type: 'string',
    mediaType: 'application/yaml',
  })
  async yaml({ response }: HttpContext) {
    const openapi = await app.container.make('openapi')
    const document = await openapi.buildDocument()

    const body = YAML.stringify(document)

    return response.status(200).header('Content-Type', 'application/yaml').send(body)
  }
}
