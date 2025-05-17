import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@foadonis/openapi/decorators'

export default class DemoController {
  @ApiOperation({ summary: 'Generate a super cool thing' })
  @ApiResponse({ type: User })
  @ApiHeader({ name: 'hey' })
  async index() {
    console.log('hello worl')
  }

  @ApiOperation({ summary: 'Generate a super cool thing' })
  @ApiParam({ name: 'id', description: 'The id of the thing to generate' })
  async show({ params }: HttpContext) {
    console.log(params.id)
  }
}
