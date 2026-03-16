import { type HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import type Stripe from 'stripe'

function assertStripeEvent(body: object): asserts body is Stripe.Event {
  if (!('type' in body) || !('data' in body) || !('id' in body)) {
    throw new Error('Invalid Stripe event payload')
  }
}

export async function handleWebhook(ctx: HttpContext) {
  const payload = ctx.request.body()
  assertStripeEvent(payload)

  await emitter.emit(`stripe:${payload.type}`, payload)
  await emitter.emit(`stripe:${payload.type}:handled`, payload)
}
