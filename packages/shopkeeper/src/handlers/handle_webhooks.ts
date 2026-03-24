import type Stripe from 'stripe'
import { type HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import { isStripeEvent } from '../utils/errors.js'

function assertStripeEvent(body: unknown): asserts body is Stripe.Event {
  if (!isStripeEvent(body)) {
    throw new Error('Invalid Stripe event payload')
  }
}

export async function handleWebhook(ctx: HttpContext) {
  const payload = ctx.request.body()
  assertStripeEvent(payload)

  const alreadyProcessed = await db
    .from('stripe_webhook_events')
    .where('event_id', payload.id)
    .first()

  if (alreadyProcessed) {
    return ctx.response.ok({ received: true })
  }

  await db.transaction(async (trx) => {
    await trx.table('stripe_webhook_events').insert({
      event_id: payload.id,
      created_at: new Date(),
    })

    await emitter.emit(`stripe:${payload.type}`, payload)
    await emitter.emit(`stripe:${payload.type}:handled`, payload)
  })
}
