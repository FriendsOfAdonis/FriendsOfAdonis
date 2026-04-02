import { type HttpContext } from '@adonisjs/core/http'
import { assertStripeEvent } from '../utils/errors.ts'
import emitter from '@adonisjs/core/services/emitter'

export default class ShopkeeperWebhookController {
  async handle({ request }: HttpContext) {
    const payload = request.body()
    assertStripeEvent(payload)

    await emitter.emit(`stripe:${payload.type}`, payload)
    await emitter.emit(`stripe:${payload.type}:handled`, payload)
  }
}
