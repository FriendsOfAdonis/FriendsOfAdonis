import type Stripe from 'stripe'
import { type HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import { isStripeEvent } from '../utils/errors.js'

function assertStripeEvent(body: unknown): asserts body is Stripe.Event {
  if (!isStripeEvent(body)) {
    throw new Error('Invalid Stripe event payload')
  }
}

export async function handleWebhook(ctx: HttpContext) {
  const payload = ctx.request.body()
  assertStripeEvent(payload)

  await emitter.emit(`stripe:${payload.type}`, payload)
  await emitter.emit(`stripe:${payload.type}:handled`, payload)
}
