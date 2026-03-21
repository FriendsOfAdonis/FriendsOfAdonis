import { BaseOpenAPIController } from '@foadonis/openapi'

export default class OpenAPIV1Controller extends BaseOpenAPIController {
  constructor() {
    super({ document: 'v1', ui: 'scalar' })
  }
}
