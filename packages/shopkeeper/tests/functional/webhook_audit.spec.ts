import { test } from '@japa/runner'
import string from '@adonisjs/core/helpers/string'
import type Stripe from 'stripe'
import { createApp } from '../app.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'
import db from '@adonisjs/lucid/services/db'

function randomEventId() {
  return `evt_${string.random(16)}`
}

function fakeEvent(overrides: Partial<Stripe.Event> = {}): Stripe.Event {
  return {
    id: randomEventId(),
    object: 'event',
    api_version: '2024-04-10',
    created: Math.floor(Date.now() / 1000),
    type: 'customer.subscription.created',
    livemode: false,
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
    data: {
      object: {} as any,
    },
    ...overrides,
  } as Stripe.Event
}

let shopkeeper: Shopkeeper

test.group('Webhook Audit', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper
  })

  test('processes event and records it in the database', async ({ assert }) => {
    const event = fakeEvent()
    let callbackExecuted = false

    const result = await shopkeeper.webhookAudit(event, async (_trx) => {
      callbackExecuted = true
    })

    assert.isTrue(result)
    assert.isTrue(callbackExecuted)

    const row = await db.from('stripe_webhook_events').where('event_id', event.id).first()
    assert.isNotNull(row)
    assert.equal(row.event_id, event.id)

    const payload = JSON.parse(row.event_payload)
    assert.equal(payload.id, event.id)
    assert.equal(payload.type, event.type)
  })

  test('skips already processed event', async ({ assert }) => {
    const event = fakeEvent()
    let callCount = 0

    await shopkeeper.webhookAudit(event, async (_trx) => {
      callCount++
    })

    const result = await shopkeeper.webhookAudit(event, async (_trx) => {
      callCount++
    })

    assert.isFalse(result)
    assert.equal(callCount, 1)
  })

  test('rolls back when callback throws', async ({ assert }) => {
    const event = fakeEvent()

    await assert.rejects(async () => {
      await shopkeeper.webhookAudit(event, async (_trx) => {
        throw new Error('business logic failed')
      })
    }, 'business logic failed')

    const row = await db.from('stripe_webhook_events').where('event_id', event.id).first()
    assert.isNull(row)
  })

  test('event can be retried after a failure', async ({ assert }) => {
    const event = fakeEvent()

    await assert.rejects(async () => {
      await shopkeeper.webhookAudit(event, async (_trx) => {
        throw new Error('temporary failure')
      })
    })

    let retried = false
    const result = await shopkeeper.webhookAudit(event, async (_trx) => {
      retried = true
    })

    assert.isTrue(result)
    assert.isTrue(retried)

    const row = await db.from('stripe_webhook_events').where('event_id', event.id).first()
    assert.isNotNull(row)
  })

  test('callback receives a transaction', async ({ assert }) => {
    const event = fakeEvent()

    await shopkeeper.webhookAudit(event, async (trx) => {
      assert.isDefined(trx)
      assert.isFunction(trx.insertQuery)
      assert.isFunction(trx.query)
    })
  })
})
