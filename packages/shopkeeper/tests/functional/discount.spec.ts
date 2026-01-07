import { test } from '@japa/runner'
import type Stripe from 'stripe'
import string from '@adonisjs/core/helpers/string'
import { createCustomer } from '../utils.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'
import { createApp } from '../app.js'

let product: Stripe.Product
let price: Stripe.Price
let coupon: Stripe.Coupon
let coupon2: Stripe.Coupon
let promotionCode: Stripe.PromotionCode
const code = string.create(string.random(16)).pascalCase().toString()

let shopkeeper: Shopkeeper
test.group('Discount', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper
    product = await shopkeeper.stripe.products.create({
      name: 'Discount Test Product',
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

    coupon = await shopkeeper.stripe.coupons.create({
      duration: 'repeating',
      amount_off: 500,
      duration_in_months: 3,
      currency: 'EUR',
    })

    coupon2 = await shopkeeper.stripe.coupons.create({
      duration: 'once',
      percent_off: 20,
      currency: 'EUR',
    })

    promotionCode = await shopkeeper.stripe.promotionCodes.create({
      coupon: coupon2.id,
      code,
    })
  })

  test('applying discounts to existing customers', async ({ assert }) => {
    const user = await createCustomer('applying_coupons_to_existing_customers')

    await user.newSubscription('main', [price.id]).create('pm_card_visa')

    await user.applyCoupon(coupon.id)

    assert.equal(await user.discount().then((d) => d?.coupon().asStripeCoupon().id), coupon.id)

    await user.applyPromotionCode(promotionCode.id)

    const discount = await user.discount()

    assert.equal(discount?.coupon()?.asStripeCoupon().id, coupon2.id)
    assert.equal(discount?.promotionCode()?.asStripePromotionCode().id, promotionCode.id)
    assert.equal(discount?.promotionCode()?.coupon().asStripeCoupon().id, coupon2.id)
    assert.equal(discount?.promotionCode()?.asStripePromotionCode().code, code)
  })

  test('applying discounts to existing subscriptions', async ({ assert }) => {
    const user = await createCustomer('applying_coupons_to_existing_suscriptions')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    await subscription.applyCoupon(coupon.id)

    assert.equal(
      await subscription.discount().then((d) => d?.coupon().asStripeCoupon().id),
      coupon.id
    )

    await subscription.applyPromotionCode(promotionCode.id)

    const discount = await subscription.discount()

    assert.equal(discount?.coupon()?.asStripeCoupon().id, coupon2.id)
    assert.equal(discount?.promotionCode()?.asStripePromotionCode().id, promotionCode.id)
    assert.equal(discount?.promotionCode()?.coupon().asStripeCoupon().id, coupon2.id)
    assert.equal(discount?.promotionCode()?.asStripePromotionCode().code, code)
  })

  test('customers can retrieve a promotion code', async ({ assert }) => {
    const user = await createCustomer('customers_can_retrieve_a_promotion_code')

    const pc = await user.findPromotionCode(code)

    assert.equal(pc?.code(), code)

    const inactivePromotionCode = await shopkeeper.stripe.promotionCodes.create({
      active: false,
      coupon: coupon.id,
      code: 'NEWYEAR',
    })

    const found = await user.findActivePromotionCode(inactivePromotionCode.id)

    assert.isNull(found)
  })
})
