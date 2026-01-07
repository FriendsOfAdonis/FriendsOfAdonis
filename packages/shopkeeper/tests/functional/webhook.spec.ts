import { test } from '@japa/runner'
import Subscription from '../../src/models/subscription.js'
import { createCustomer } from '../utils.js'
import SubscriptionItem from '../../src/models/subscription_item.js'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import type Stripe from 'stripe'
import { createApp } from '../app.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'

function randomCustomerId() {
  return `cus_${string.random(16)}`
}

function randomSubscriptionId() {
  return `sub_${string.random(16)}`
}

function randomSubscriptionItemId() {
  return `sub_${string.random(10)}`
}

let product: Stripe.Product
let price: Stripe.Price

let shopkeeper: Shopkeeper
test.group('Webhook', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper

    product = await shopkeeper.stripe.products.create({
      name: 'Adonis Test Product',
      type: 'service',
    })
    price = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Test Price',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      billing_scheme: 'per_unit',
      unit_amount: 1000,
    })
  })

  test('subscriptions are created', async ({ client }) => {
    const user = await createCustomer('subscriptions_are_created', { stripeId: randomCustomerId() })
    const subscriptionId = randomSubscriptionId()
    const itemId = randomSubscriptionItemId()
    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.created',
      data: {
        object: {
          id: subscriptionId,
          customer: user.stripeId,
          cancel_at_period_end: false,
          quantity: 10,
          items: {
            data: [{ id: itemId, price: { id: 'price_foo', product: 'prod_bar' }, quantity: 10 }],
          },
          status: 'active',
        },
      },
    })

    response.assertStatus(200)

    // TODO: Filter quantity
    const subscription = await Subscription.findByOrFail({
      type: 'default',
      userId: user.id,
      stripeId: subscriptionId,
      stripeStatus: 'active',
    })

    await SubscriptionItem.findByOrFail({
      subscriptionId: subscription.id,
      stripeId: itemId,
      stripeProduct: 'prod_bar',
      stripePrice: 'price_foo',
      quantity: 10,
    })
  })

  test('subscriptions are updated', async ({ client, assert }) => {
    const user = await createCustomer('subscriptions_are_updated', { stripeId: randomCustomerId() })

    const subscriptionId = randomSubscriptionId()
    const itemId = randomSubscriptionItemId()

    const subscription = await user.related('subscriptions').create({
      type: 'main',
      stripeId: subscriptionId,
      stripePrice: 'price_foo',
      stripeStatus: 'active',
    })

    const item = await subscription.related('items').create({
      stripeId: randomSubscriptionItemId(),
      stripeProduct: 'prod_bar',
      stripePrice: 'price_bar',
      quantity: 1,
    })

    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subscription.stripeId,
          customer: user.stripeId,
          cancel_at_period_end: false,
          items: {
            data: [{ id: itemId, price: { id: 'price_foo', product: 'prod_bar' }, quantity: 5 }],
          },
        },
      },
    })

    response.assertStatus(200)

    await Subscription.findByOrFail({
      id: subscription.id,
      userId: user.id,
      stripeId: subscriptionId,
    })

    await SubscriptionItem.findByOrFail({
      subscriptionId: subscription.id,
      stripeId: itemId,
      stripeProduct: 'prod_bar',
      stripePrice: 'price_foo',
      quantity: 5,
    })

    assert.isNull(await SubscriptionItem.find(item.id))
  })

  test('subscriptions on update cancel at date is correct', async ({ assert, client }) => {
    const user = await createCustomer('subscriptions_on_update_cancel_at_date_is_correct', {
      stripeId: randomCustomerId(),
    })

    const cancelDate = DateTime.now().plus({ month: 6 })

    const newItemId = randomSubscriptionItemId()
    const subscription = await user.related('subscriptions').create({
      type: 'main',
      stripeId: randomSubscriptionId(),
      stripePrice: 'price_foo',
      stripeStatus: 'active',
    })

    const item = await subscription.related('items').create({
      stripeId: randomSubscriptionItemId(),
      stripeProduct: 'prod_bar',
      stripePrice: 'price_bar',
      quantity: 1,
    })

    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subscription.stripeId,
          customer: user.stripeId,
          cancel_at: cancelDate.toUnixInteger(),
          cancel_at_period_end: false,
          items: {
            data: [{ id: newItemId, price: { id: 'price_foo', product: 'prod_bar' }, quantity: 5 }],
          },
        },
      },
    })

    response.assertStatus(200)

    const sub = await Subscription.findByOrFail({
      id: subscription.id,
      userId: user.id,
      stripeId: subscription.stripeId,
    })

    assert.equal(sub.endsAt?.toUnixInteger(), cancelDate.toUnixInteger())

    await SubscriptionItem.findByOrFail({
      subscriptionId: subscription.id,
      stripeId: newItemId,
      stripeProduct: 'prod_bar',
      stripePrice: 'price_foo',
      quantity: 5,
    })

    assert.isNull(await SubscriptionItem.find(item.id))
  })

  test('canceled subscription is properly reactivated', async ({ assert, client }) => {
    const user = await createCustomer('canceled_subscription_is_properly_reactivated')
    const subscription = await user.newSubscription('main', price.id).create('pm_card_visa')

    await subscription.cancel()

    assert.isTrue(subscription.canceled())

    await subscription.load('items')

    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subscription.stripeId,
          customer: user.stripeId,
          cancel_at_period_end: false,
          items: {
            data: [
              {
                id: subscription.items[0].stripeId,
                price: { id: price.id, product: product.id },
                quantity: 1,
              },
            ],
          },
        },
      },
    })

    response.assertStatus(200)

    assert.isFalse(await subscription.refresh().then((s) => s.canceled()))
  })

  test('subscription is marked as canceled when deleted in stripe', async ({ assert, client }) => {
    const user = await createCustomer('subscription_is_marked_as_canceled_when_deleted_in_stripe')
    const subscription = await user.newSubscription('main', price.id).create('pm_card_visa')

    assert.isFalse(subscription.canceled())

    await subscription.load('items')

    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.deleted',
      data: {
        object: { id: subscription.stripeId, customer: user.stripeId, quantity: 1 },
      },
    })

    response.assertStatus(200)

    assert.isTrue(await subscription.refresh().then((s) => s.canceled()))
  })

  test('subscription is deleted when status is incomplete expired', async ({ assert, client }) => {
    const user = await createCustomer('subscription_is_deleted_when_status_is_incomplete_expired')
    const subscription = await user.newSubscription('main', price.id).create('pm_card_visa')

    const response = await client.post('/stripe/webhook').json({
      id: 'foo',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subscription.stripeId,
          customer: user.stripeId,
          status: 'incomplete_expired',
          quantity: 1,
        },
      },
    })

    response.assertStatus(200)

    assert.empty(await user.related('subscriptions').query())
  })
})
