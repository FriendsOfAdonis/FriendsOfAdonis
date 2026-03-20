import UserRegistered from '#events/user_registered'
import { compose } from '@adonisjs/core/helpers'
import { AsController, BaseAction } from '@foadonis/actions'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@foadonis/openapi/decorators'
import vine from '@vinejs/vine'

const Schema = vine.create({
  name: vine.string(),
})

@ApiTags('Recipe')
export default class CreateRecipeAction extends compose(BaseAction, AsController()) {
  handle(hello: string) {
    this.logger.info(`Hello world: ${hello}`)
    UserRegistered.dispatch('recipe created')
  }

  @ApiOperation({ summary: 'Create recipe' })
  @ApiBody({ type: () => Schema })
  @ApiResponse({
    type: () =>
      vine.object({
        test: vine.string(),
      }),
  })
  asController() {
    return this.handle('from http test')
  }
}
