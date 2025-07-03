import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import app from '@adonisjs/core/services/app'
import Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'

export async function handleWebhook(ctx: HttpContext) {
  if (app.inProduction && !shopkeeper.config.webhook.secret) {
    return ctx.response.abort('Invalid webhook configuration', 500)
  }

  if (shopkeeper.config.webhook.secret) {
    const sig = ctx.request.header('stripe-signature')
    const body = ctx.request.raw()

    if (!body || !sig) {
      return ctx.response.abort('Invalid webhook request')
    }

    const valid = shopkeeper.stripe.webhooks.signature.verifyHeader(
      body,
      sig,
      shopkeeper.config.webhook.secret,
      shopkeeper.config.webhook.tolerance
    )

    if (!valid) {
      return ctx.response.abort('Invalid webhook request')
    }
  }

  const payload = ctx.request.body() as Stripe.Event

  await emitter.emit(`stripe:${payload.type}`, payload)
  await emitter.emit(`stripe:${payload.type}:handled`, payload)
}
