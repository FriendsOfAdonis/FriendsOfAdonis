import { ApiOperation, ApiResponse, ApiHeader } from '@foadonis/openapi/decorators'
import UserTransformer from '../transformers/user_transformer.ts'
import User from '#models/user'

export default class DemoController {
  @ApiOperation({ summary: 'Generate a super cool thing' })
  @ApiResponse({ type: () => UserTransformer.schema(User).useVariant('toDetailed') })
  @ApiHeader({ name: 'hey' })
  async index() {
    console.log('hello worl')
  }
}
