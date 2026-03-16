import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'
import shopkeeper from '../../services/shopkeeper.js'
import { InvalidWebhookError } from '../errors/invalid_webhook.js'

export default class StripeWebhookMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    const sig = request.header('stripe-signature')
    const body = request.raw()

    if (!body || !sig) {
      throw InvalidWebhookError.missingSignature()
    }

    const secret = shopkeeper.config.webhook.secret
    if (!secret) {
      throw InvalidWebhookError.missingSecret()
    }

    const valid = shopkeeper.stripe.webhooks.signature.verifyHeader(
      body,
      sig,
      secret,
      shopkeeper.config.webhook.tolerance
    )

    if (!valid) {
      throw InvalidWebhookError.invalidSignature()
    }

    await next()
  }
}
