import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import { Checkout } from '../../src/checkout.js'
import { createApp } from '../app.js'

test.group('Checkout', () => {
  test('customers can start a product checkout session', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('customers_can_start_a_product_checkout_session')

    const price1 = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Product 1',
      },
      unit_amount: 1500,
    })

    const price2 = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Product 2',
      },
      unit_amount: 1500,
    })

    const checkout = await user
      .checkout()
      .addLineItem(price1.id, 5)
      .addLineItem(price2.id, 1)
      .sessionParams({
        success_url: 'http://example.org',
        cancel_url: 'http://example.org',
      })

    assert.instanceOf(checkout, Checkout)
  })

  test('customers can start a product checkout session with a coupon applied', async ({
    assert,
  }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer(
      'customers_can_start_a_product_checkout_session_with_a_coupon_applied'
    )

    const price = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Product 1',
      },
      unit_amount: 1500,
    })

    const coupon = await shopkeeper.stripe.coupons.create({
      duration: 'repeating',
      amount_off: 500,
      duration_in_months: 3,
      currency: 'EUR',
    })

    const checkout = await user
      .checkout()
      .addLineItem(price.id)
      .withCoupon(coupon.id)
      .sessionParams({
        success_url: 'http://example.org',
        cancel_url: 'http://example.org',
      })

    assert.instanceOf(checkout, Checkout)
  })

  test('customers can start a one off charge checkout session', async ({ assert }) => {
    const user = await createCustomer('customers_can_start_a_one_off_charge_checkout_session')

    const checkout = await user.checkoutCharge(1200, 'Sinoda').sessionParams({
      success_url: 'http://example.org',
      cancel_url: 'http://example.org',
    })

    assert.instanceOf(checkout, Checkout)
  })

  test('customers can start a subscription checkout session', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('customers_can_start_a_subscription_checkout_session')

    const price = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Edgewire',
      },
      nickname: 'Edge Wire',
      recurring: { interval: 'year' },
      unit_amount: 1500,
    })

    const taxRate = await shopkeeper.stripe.taxRates.create({
      display_name: 'VAT',
      description: 'VAT France',
      jurisdiction: 'FR',
      percentage: 20,
      inclusive: false,
    })

    user.stripeTaxRates = [taxRate.id]

    let checkout = await user
      .newSubscription('default', price.id)
      .withAllowPromotionsCodes()
      .checkout({
        success_url: 'http://example.org',
        cancel_url: 'http://example.org',
      })

    assert.instanceOf(checkout, Checkout)
    assert.isTrue(checkout.asStripeSession().allow_promotion_codes)
    assert.equal(checkout.asStripeSession().amount_total, 1800)

    const coupon = await shopkeeper.stripe.coupons.create({
      duration: 'repeating',
      amount_off: 500,
      duration_in_months: 3,
      currency: 'EUR',
    })

    checkout = await user.newSubscription('default', price.id).withCoupon(coupon.id).checkout({
      success_url: 'http://example.org',
      cancel_url: 'http://example.org',
    })

    assert.instanceOf(checkout, Checkout)
    assert.isNull(checkout.asStripeSession().allow_promotion_codes)
    assert.equal(checkout.asStripeSession().amount_total, 1200)
  })

  test('guest customers can start a checkout session', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const price = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Edgewire',
      },
      unit_amount: 1500,
    })

    const checkout = await Checkout.guest()
      .addLineItem(price.id)
      .sessionParams({
        success_url: 'http://example.org',
        cancel_url: 'http://example.org',
      })

    assert.instanceOf(checkout, Checkout)
  })

  test('customers can start an embedded product checkout session', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('customers_can_start_a_subscription_checkout_session')

    const price = await shopkeeper.stripe.prices.create({
      currency: 'EUR',
      product_data: {
        name: 'Edgewire',
      },
      unit_amount: 1500,
    })

    const checkout = await user
      .checkout()
      .addLineItem(price.id, 5)
      .sessionParams({
        ui_mode: 'embedded',
        return_url: 'http://example.org',
      })

    assert.instanceOf(checkout, Checkout)
  })
})
