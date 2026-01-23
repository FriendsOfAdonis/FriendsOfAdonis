import UserRegistered from '#events/user_registered'
import { type HttpContext } from '@adonisjs/http-server'
import { type AsController, BaseAction } from '@foadonis/actions'
import { ApiOperation, ApiTags } from '@foadonis/openapi/decorators'

@ApiTags('Recipe')
export default class CreateRecipeAction extends BaseAction implements AsController {
  handle(hello: string) {
    this.logger.info(`Hello world: ${hello}`)
    UserRegistered.dispatch('recipe created')
  }

  @ApiOperation({ summary: 'Create recipe' })
  asController(context: HttpContext) {
    return this.handle('from http test')
  }
}
