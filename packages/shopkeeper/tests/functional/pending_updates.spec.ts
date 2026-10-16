import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import type Stripe from 'stripe'
import { checkStripeError } from '../../src/utils/errors.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'
import { createApp } from '../app.js'

let product: Stripe.Product
let price: Stripe.Price
let premiumPrice: Stripe.Price

let shopkeeper: Shopkeeper
test.group('PendingUpdates', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper
    product = await shopkeeper.stripe.products.create({
      name: 'Test Product',
      type: 'service',
    })

    price = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      billing_scheme: 'per_unit',
      unit_amount: 1000,
    })

    premiumPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly Premium',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      billing_scheme: 'per_unit',
      unit_amount: 2000,
    })
  })

  test('subscription can error if incomplete', async ({ assert }) => {
    const user = await createCustomer('subscription_can_error_if_incomplete')

    let subscription = await user.newSubscription('main', price.id).create('pm_card_visa')

    await user.updateDefaultPaymentMethod('pm_card_threeDSecure2Required')

    try {
      await subscription.errorIfPaymentFails().swapAndInvoice(premiumPrice.id)
      throw new Error('Expected exception')
    } catch (e) {
      checkStripeError(e, 'StripeCardError')

      subscription = await subscription.refresh()

      assert.equal(subscription.stripePrice, price.id)
      assert.isTrue(subscription.active())
    }
  })
})
