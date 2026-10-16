import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'
import { Shopkeeper } from '../shopkeeper.js'
import { InvalidWebhookError } from '../errors/invalid_webhook.js'
import { Logger } from '@adonisjs/core/logger'
import { inject } from '@adonisjs/core'

@inject()
export default class StripeWebhookMiddleware {
  constructor(
    private shopkeeper: Shopkeeper,
    private logger: Logger
  ) {}

  async handle({ request }: HttpContext, next: NextFn) {
    const secret = this.shopkeeper.config.webhook.secret

    if (!secret) {
      this.logger.warn(`No Stripe Webhook secret configured. This will fail in production.`)
      return next()
    }

    const signature = request.header('stripe-signature')
    const body = request.raw()

    if (!body || !signature) {
      throw InvalidWebhookError.missingSignature()
    }

    const valid = this.shopkeeper.stripe.webhooks.signature.verifyHeader(
      body,
      signature,
      secret.release(),
      this.shopkeeper.config.webhook.tolerance
    )

    if (!valid) {
      throw InvalidWebhookError.invalidSignature()
    }

    await next()
  }
}
