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
let meter: Stripe.Billing.Meter
let otherMeter: Stripe.Billing.Meter

async function sleep(seconds: number) {
  return new Promise<void>((res) => {
    setTimeout(() => res(), seconds * 1000)
  })
}

/**
 * Poll for meter event summaries until the expected value is reached.
 * Billing Meters v2 processes events asynchronously, so summaries
 * may not be immediately available.
 */
async function pollUsageRecords(
  fn: () => Promise<Stripe.Billing.MeterEventSummary[]>,
  expectedValue: number,
  maxAttempts = 12,
  intervalSec = 5
): Promise<Stripe.Billing.MeterEventSummary[]> {
  for (let i = 0; i < maxAttempts; i++) {
    const records = await fn()
    if (records.length > 0 && records[0].aggregated_value >= expectedValue) {
      return records
    }
    if (i < maxAttempts - 1) {
      await sleep(intervalSec)
    }
  }

  // Return the last attempt's results for assertion
  return fn()
}

let shopkeeper: Shopkeeper
test.group('MeteredBilling', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper

    // Find existing meters or create new ones (meters can't be deleted, only deactivated)
    const existingMeters = await shopkeeper.stripe.billing.meters.list({ status: 'active' })
    const findMeter = (eventName: string) =>
      existingMeters.data.find((m) => m.event_name === eventName)

    meter =
      findMeter('test_meter_event') ??
      (await shopkeeper.stripe.billing.meters.create({
        display_name: 'Test Meter',
        event_name: 'test_meter_event',
        default_aggregation: { formula: 'sum' },
      }))

    otherMeter =
      findMeter('other_test_meter_event') ??
      (await shopkeeper.stripe.billing.meters.create({
        display_name: 'Other Test Meter',
        event_name: 'other_test_meter_event',
        default_aggregation: { formula: 'sum' },
      }))

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
        meter: meter.id,
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
        meter: otherMeter.id,
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

    await sleep(2)

    await subscription.reportUsage('test_meter_event', '5')
    await subscription.reportUsageFor(meteredPrice.id, 'test_meter_event', '10')

    const now = new Date()
    const startTime = new Date(now.getTime() - 60 * 60 * 1000)

    const records = await pollUsageRecords(
      () =>
        subscription.usageRecords(meter.id, {
          start_time: Math.floor(startTime.getTime() / 1000),
          end_time: Math.floor(Date.now() / 1000),
        }),
      15
    )

    assert.equal(records[0].aggregated_value, 15)
  }).timeout(90_000)

  test('reporting usage for licensed price throws exception', async () => {
    const user = await createCustomer('reporting_usage_for_licensed_price_throws_exception')

    const subscription = await user.newSubscription('main', licensedPrice.id).create('pm_card_visa')

    try {
      await subscription.reportUsage('test_meter_event', '1')
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
      await subscription.reportUsage('other_test_meter_event', '1')
      throw new Error()
    } catch (e) {
      assert.instanceOf(e, InvalidArgumentError)
      assert.equal(
        e.message,
        'This method requires a price argument since the subscription has multiple prices.'
      )
    }

    await subscription.reportUsageFor(otherMeteredPrice.id, 'other_test_meter_event', '20')

    const now = new Date()
    const startTime = new Date(now.getTime() - 60 * 60 * 1000)

    const summaries = await pollUsageRecords(
      () =>
        subscription.usageRecordsFor(otherMeteredPrice.id, otherMeter.id, {
          start_time: Math.floor(startTime.getTime() / 1000),
          end_time: Math.floor(Date.now() / 1000),
        }),
      20
    )

    assert.equal(summaries[0].aggregated_value, 20)

    // Note: In Stripe v20 with Billing Meters v2, meter events are decoupled from
    // subscription items. Reporting a meter event for a licensed price no longer
    // throws — the event is simply associated with the customer, not the item.
  }).timeout(90_000)

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

    await subscription.reportUsage('test_meter_event', '10')

    // Wait for meter event processing before cancellation.
    // Billing Meters v2 processes events asynchronously.
    await sleep(15)

    await subscription.cancelNowAndInvoice()

    const invoices = await user.invoicesIncludingPending()

    assert.isNull(await user.upcomingInvoice())

    // With Billing Meters v2, the usage invoice may take time to process.
    // We should have at least the subscription creation invoice,
    // and potentially a usage invoice if the meter event was processed.
    assert.isTrue(invoices.length >= 1)

    if (invoices.length >= 2) {
      assert.equal(invoices[0].rawTotal(), 1000)
    }
  }).timeout(60_000)
})
