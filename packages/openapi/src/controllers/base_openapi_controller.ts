import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { ApiOperation, ApiResponse } from '@martin.xyz/openapi-decorators/decorators'
import YAML from 'yaml'
import { OpenAPIDocuments } from '../types.ts'

export type OpenAPIControllerOptions = {
  document: keyof OpenAPIDocuments
  ui: 'scalar' | 'swagger' | 'rapidoc'
}

export abstract class BaseOpenAPIController {
  constructor(protected options: OpenAPIControllerOptions) {}

  @ApiOperation({
    summary: 'Documentation UI',
    description: 'Displays the OpenAPI documentation UI.',
  })
  @ApiResponse({
    description: 'The documentation UI',
    type: 'string',
    mediaType: 'text/html',
  })
  async html({ request, response }: HttpContext) {
    const openapi = await app.container.make('openapi')

    const url = `${request.parsedUrl.pathname}.json`

    const content = openapi.ui(this.options.ui, url)

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
    const document = await openapi.document(this.options.document, !app.inProduction)

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
    const document = await openapi.document(this.options.document, !app.inProduction)

    const body = YAML.stringify(document)

    return response.status(200).header('Content-Type', 'application/yaml').send(body)
  }
}
