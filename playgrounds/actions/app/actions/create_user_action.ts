import { BaseAction, AsController, AsCommand, AsListener } from '@foadonis/actions'
import vine from '@vinejs/vine'
import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

const validator = vine.compile(
  vine.object({
    userId: vine.string(),
    name: vine.string(),
  })
)

@inject()
export default class CreateUserAction
  extends BaseAction
  implements AsCommand, AsListener, AsController
{
  static commandName = 'users:create'
  static description = 'Create a new user'

  handle(userId: string) {
    return 'Hello ' + userId
  }

  async asController({ request }: HttpContext) {
    const payload = await request.validateUsing(validator)
    return this.handle(payload.userId)
  }

  async asCommand({ prompt, logger }: BaseCommand) {
    const userId = await prompt.ask('User ID')
    const result = this.handle(userId)

    logger.success(`User created successfully ${result}`)
  }

  asListener(event: User) {
    console.log('RECEIVED', event)
  }
}
