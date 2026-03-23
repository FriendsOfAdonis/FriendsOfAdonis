import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'
import { inject } from '@adonisjs/core'
import { Shopkeeper } from '../shopkeeper.js'
import { InvalidWebhookError } from '../errors/invalid_webhook.js'

@inject()
export default class StripeWebhookMiddleware {
  constructor(private shopkeeper: Shopkeeper) {}

  async handle({ request }: HttpContext, next: NextFn) {
    const sig = request.header('stripe-signature')
    const body = request.raw()

    if (!body || !sig) {
      throw InvalidWebhookError.missingSignature()
    }

    const secret = this.shopkeeper.config.webhook.secret
    if (!secret) {
      throw InvalidWebhookError.missingSecret()
    }

    const valid = this.shopkeeper.stripe.webhooks.signature.verifyHeader(
      body,
      sig,
      secret,
      this.shopkeeper.config.webhook.tolerance
    )

    if (!valid) {
      throw InvalidWebhookError.invalidSignature()
    }

    await next()
  }
}
