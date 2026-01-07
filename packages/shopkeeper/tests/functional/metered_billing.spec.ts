import { test } from '@japa/runner'
import type Stripe from 'stripe'
import { createCustomer } from '../utils.js'
import { checkStripeError } from '../../src/utils/errors.js'
import { InvalidArgumentError } from '../../src/errors/invalid_argument.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'
import { createApp } from '../app.js'

let product: Stripe.Product
let meteredPrice: Stripe.Price
let otherMeteredPrice: Stripe.Price
let licensedPrice: Stripe.Price

async function sleep(seconds: number) {
  return new Promise<void>((res) => {
    setTimeout(() => res(), seconds * 1000)
  })
}

let shopkeeper: Shopkeeper
test.group('MeteredBilling', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper
    product = await shopkeeper.stripe.products.create({
      name: 'Test Product',
      type: 'service',
    })

    meteredPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly Metered',
      currency: 'EUR',
      recurring: {
        interval: 'month',
        usage_type: 'metered',
      },
      unit_amount: 100,
    })

    otherMeteredPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly Metered Other',
      currency: 'EUR',
      recurring: {
        interval: 'month',
        usage_type: 'metered',
      },
      unit_amount: 200,
    })

    licensedPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly Licensed',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      unit_amount: 1000,
    })
  })

  test('report usage for metered price', async ({ assert }) => {
    const user = await createCustomer('report_usage_for_metered_price')

    const subscription = await user
      .newSubscription('main')
      .meteredPrice(meteredPrice.id)
      .create('pm_card_visa')

    await sleep(1)

    await subscription.reportUsage(5)
    await subscription.reportUsageFor(meteredPrice.id, 10)

    const records = await subscription.usageRecords()

    assert.equal(records[0].total_usage, 15)
  })

  test('reporting usage for licensed price throws exception', async () => {
    const user = await createCustomer('reporting_usage_for_licensed_price_throws_exception')

    const subscription = await user.newSubscription('main', licensedPrice.id).create('pm_card_visa')

    try {
      await subscription.reportUsage()
    } catch (e) {
      checkStripeError(e, 'StripeInvalidRequestError')
    }
  })

  test('reporting usage for subscriptions with multiples prices', async ({ assert }) => {
    const user = await createCustomer('reporting_usage_for_subscriptions_with_multiple_prices')

    const subscription = await user
      .newSubscription('main', [licensedPrice.id])
      .meteredPrice(meteredPrice.id)
      .meteredPrice(otherMeteredPrice.id)
      .create('pm_card_visa')

    await subscription.load('items')

    assert.lengthOf(subscription.items, 3)

    try {
      await subscription.reportUsage()
      throw new Error()
    } catch (e) {
      assert.instanceOf(e, InvalidArgumentError)
      assert.equal(
        e.message,
        'This method requires a price argument since the subscription has multiple prices.'
      )
    }

    await subscription.reportUsageFor(otherMeteredPrice.id, 20)

    const summary = await subscription.usageRecordsFor(otherMeteredPrice.id).then((s) => s[0])

    assert.equal(summary.total_usage, 20)

    try {
      await subscription.reportUsageFor(licensedPrice.id)
      throw new Error()
    } catch (e) {
      checkStripeError(e, 'StripeInvalidRequestError')
    }
  })

  test('swap metered price to difference price', async ({ assert }) => {
    const user = await createCustomer('swap_metered_price_to_different_price')
    let subscription = await user
      .newSubscription('main')
      .meteredPrice(meteredPrice.id)
      .create('pm_card_visa')

    assert.equal(subscription.stripePrice, meteredPrice.id)
    assert.isUndefined(subscription.quantity)

    subscription = await subscription.swap(otherMeteredPrice.id)

    assert.equal(subscription.stripePrice, otherMeteredPrice.id)
    assert.isNull(subscription.quantity)

    subscription = await subscription.swap(licensedPrice.id)

    assert.equal(subscription.stripePrice, licensedPrice.id)
    assert.equal(subscription.quantity, 1)
  })

  test('swap metered price to different price with a subscription with multiple prices', async ({
    assert,
  }) => {
    const user = await createCustomer(
      'swap_metered_price_to_different_price_with_a_subscription_with_multiple_prices'
    )

    let subscription = await user
      .newSubscription('main')
      .meteredPrice(meteredPrice.id)
      .create('pm_card_visa')

    assert.equal(subscription.stripePrice, meteredPrice.id)

    subscription = await subscription.swap([meteredPrice.id, otherMeteredPrice.id])

    const item = await subscription.findItemOrFail(meteredPrice.id)
    const otherItem = await subscription.findItemOrFail(otherMeteredPrice.id)

    await subscription.load('items')

    assert.lengthOf(subscription.items, 2)
    assert.isNull(subscription.stripePrice)
    assert.isNull(subscription.quantity)
    assert.equal(item.stripePrice, meteredPrice.id)
    assert.isNull(item.quantity)
    assert.equal(otherItem.stripePrice, otherMeteredPrice.id)
    assert.isNull(otherItem.quantity)

    subscription = await subscription.swap(otherMeteredPrice.id)

    await subscription.load('items')

    assert.lengthOf(subscription.items, 1)
    assert.equal(subscription.stripePrice, otherMeteredPrice.id)
    assert.isNull(subscription.quantity)

    subscription = await subscription.swap(licensedPrice.id)

    await subscription.load('items')

    assert.lengthOf(subscription.items, 1)
    assert.equal(subscription.stripePrice, licensedPrice.id)
    assert.equal(subscription.quantity, 1)

    subscription = await subscription.swap([licensedPrice.id, meteredPrice.id])

    await subscription.load('items')

    assert.lengthOf(subscription.items, 2)
    assert.isNull(subscription.stripePrice)
    assert.isNull(subscription.quantity)
  })

  test('add metered price to a subscription with multiple prices', async ({ assert }) => {
    const user = await createCustomer('add_metered_price_to_a_subscription_with_multiple_prices')

    let subscription = await user
      .newSubscription('main')
      .meteredPrice(meteredPrice.id)
      .create('pm_card_visa')

    assert.equal(subscription.stripePrice, meteredPrice.id)
    assert.isUndefined(subscription.quantity)

    subscription = await subscription.addMeteredPrice(otherMeteredPrice.id)

    await subscription.findItemOrFail(meteredPrice.id)
    await subscription.findItemOrFail(otherMeteredPrice.id)

    await subscription.load('items')
    assert.lengthOf(subscription.items, 2)
    assert.isNull(subscription.stripePrice)
    assert.isNull(subscription.quantity)
  })

  test('cancel metered subscription immediatly', async ({ assert }) => {
    const user = await createCustomer('cancel_metered_subscription_immediately')

    const subscription = await user
      .newSubscription('main')
      .meteredPrice(meteredPrice.id)
      .create('pm_card_visa')

    await subscription.reportUsage(10)
    await subscription.cancelNowAndInvoice()

    const invoices = await user.invoicesIncludingPending()

    assert.isNull(await user.upcomingInvoice())
    assert.lengthOf(invoices, 2)
    assert.equal(invoices[0].rawTotal(), 1000)
  })
})
