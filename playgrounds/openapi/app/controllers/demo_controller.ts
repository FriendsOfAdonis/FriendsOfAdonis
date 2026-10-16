import { ApiOperation, ApiResponse, ApiHeader } from '@foadonis/openapi/decorators'
import UserTransformer from '../transformers/user_transformer.ts'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import CreateRecipeAction from '#actions/recipes/create_recipe_action'

@inject()
export default class DemoController {
  @ApiOperation({ summary: 'Generate a super cool thing' })
  @ApiResponse({ type: () => UserTransformer.schema(User).useVariant('toDetailed') })
  @ApiHeader({ name: 'hey' })
  async index() {
    await CreateRecipeAction.run('heeey')
  }
}
