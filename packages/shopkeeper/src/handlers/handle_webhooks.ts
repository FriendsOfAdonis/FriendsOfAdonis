import { type HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import { assertStripeEvent } from '../utils/errors.js'

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

  await emitter.emit(`stripe:${payload.type}`, payload)
  await emitter.emit(`stripe:${payload.type}:handled`, payload)

  await db.table('stripe_webhook_events').insert({
    event_id: payload.id,
    created_at: new Date(),
  })
}
