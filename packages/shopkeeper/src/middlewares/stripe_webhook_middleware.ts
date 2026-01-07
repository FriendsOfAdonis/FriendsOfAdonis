import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'
import shopkeeper from '../../services/shopkeeper.js'

export default class StripeWebhookMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    const sig = request.header('stripe-signature')
    const body = request.raw()

    if (!body || !sig) {
      throw new Error('') // TODO: Error
    }

    const valid = shopkeeper.stripe.webhooks.signature.verifyHeader(
      body,
      sig,
      shopkeeper.config.webhook.secret!, // TODO: Error
      shopkeeper.config.webhook.tolerance
    )

    if (!valid) {
      throw new Error('') // TODO: Error
    }

    await next()
  }
}
