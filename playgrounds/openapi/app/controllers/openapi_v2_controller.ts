import { BaseOpenAPIController } from '@foadonis/openapi'

export default class OpenAPIV2Controller extends BaseOpenAPIController {
  constructor() {
    super({ document: 'v2', ui: 'scalar' })
  }
}
