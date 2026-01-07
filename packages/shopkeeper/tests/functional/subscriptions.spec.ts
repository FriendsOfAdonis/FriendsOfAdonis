import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import type Stripe from 'stripe'
import { IncompletePaymentError } from '../../src/errors/incomplete_payment.js'
import Subscription from '../../src/models/subscription.js'
import { DateTime } from 'luxon'
import User from '../fixtures/user.js'
import { Payment } from '../../src/payment.js'
import { type Shopkeeper } from '../../src/shopkeeper.js'
import { createApp } from '../app.js'

let product: Stripe.Product
let price: Stripe.Price
let otherPrice: Stripe.Price
let premiumPrice: Stripe.Price
let coupon: Stripe.Coupon

let shopkeeper: Shopkeeper
test.group('Subscriptions', (group) => {
  group.setup(async () => {
    const app = await createApp()
    shopkeeper = app.shopkeeper
    product = await shopkeeper.stripe.products.create({
      name: 'Adonis Stripe',
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

    otherPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Other',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      billing_scheme: 'per_unit',
      unit_amount: 1000,
    })

    premiumPrice = await shopkeeper.stripe.prices.create({
      product: product.id,
      nickname: 'Monthly premium',
      currency: 'EUR',
      recurring: {
        interval: 'month',
      },
      billing_scheme: 'per_unit',
      unit_amount: 2000,
    })

    coupon = await shopkeeper.stripe.coupons.create({
      duration: 'repeating',
      amount_off: 500,
      duration_in_months: 3,
      currency: 'EUR',
    })
  })

  test('subscriptions can be created', async ({ assert }) => {
    const user = await createCustomer('subscriptions_can_be_created')

    await user
      .newSubscription('main', [price.id])
      .withMetadata({ order_id: '100' })
      .create('pm_card_visa')

    await user.load('subscriptions')
    assert.lengthOf(user.subscriptions, 1)

    const subscription = await user.subscription('main')
    const stripeSubscription = await subscription?.asStripeSubscription()

    assert.isDefined(subscription?.stripeId)
    assert.equal(stripeSubscription?.metadata.order_id, '100')

    assert.isTrue(await user.subscribed('main'))
    assert.isTrue(await user.subscribedToProduct([product.id], 'main'))
    assert.isTrue(await user.subscribedToPrice([price.id], 'main'))

    assert.isFalse(await user.subscribedToPrice([price.id], 'other'))
    assert.isFalse(await user.subscribedToPrice([otherPrice.id], 'main'))

    assert.isTrue(await user.subscribed('main', price.id))
    assert.isFalse(await user.subscribed('main', otherPrice.id))

    assert.isTrue(subscription?.active())
    assert.isFalse(subscription?.canceled())

    assert.isFalse(subscription?.onGracePeriod())
    assert.isTrue(subscription?.recurring())
    assert.isFalse(subscription?.ended())

    await subscription?.cancel()

    assert.isTrue(subscription?.active())
    assert.isTrue(subscription?.canceled())
    assert.isTrue(subscription?.onGracePeriod())
    assert.isFalse(subscription?.recurring())
    assert.isFalse(subscription?.ended())

    const oldGracePeriod = subscription?.endsAt

    subscription!.endsAt = DateTime.now().minus({ days: 5 })
    await subscription?.save()

    assert.isFalse(subscription?.active())
    assert.isTrue(subscription?.canceled())
    assert.isFalse(subscription?.onGracePeriod())
    assert.isFalse(subscription?.recurring())
    assert.isTrue(subscription?.ended())

    subscription!.endsAt = oldGracePeriod!
    await subscription?.save()

    await subscription?.resume()

    assert.isTrue(subscription?.active())
    assert.isFalse(subscription?.canceled())
    assert.isFalse(subscription?.onGracePeriod())
    assert.isTrue(subscription?.recurring())
    assert.isFalse(subscription?.ended())

    await subscription?.incrementQuantity()

    assert.equal(subscription?.quantity, 2)

    await subscription?.decrementQuantity()

    assert.equal(subscription?.quantity, 1)

    await subscription?.swapAndInvoice([otherPrice.id])

    assert.equal(subscription?.stripePrice, otherPrice.id)

    const invoice = await user.invoices().then((i) => i[1])

    assert.equal(invoice.rawTotal(), 1000)
    assert.isFalse(invoice.hasDiscount())
    assert.isFalse(invoice.hasStartingBalance())
    assert.empty(await invoice.discounts())
  })

  test('swapping subscription with coupon', async ({ assert }) => {
    const user = await createCustomer('swapping_subscription_with_coupon')

    await user.newSubscription('main', [price.id]).create('pm_card_visa')

    const subscription = await user.subscription('main')

    await subscription?.swap([otherPrice.id], {
      coupon: coupon.id,
    })

    const couponId = await subscription?.discount().then((c) => c?.coupon().asStripeCoupon().id)

    assert.equal(couponId, coupon.id)
  })

  test('swapping subscription and preserve quantity', async ({ assert }) => {
    const user = await createCustomer('swapping_subscription_and_preserve_quantity')

    const subscription = await user
      .newSubscription('main', [price.id])
      .quantity(5, price.id)
      .create('pm_card_visa')

    await subscription.swap([otherPrice.id])

    assert.equal(5, subscription.quantity)
  })

  test('swapping subscription and adopting new quantity', async ({ assert }) => {
    const user = await createCustomer('swapping_subscription_and_adoptin_new_quantity')

    const subscription = await user
      .newSubscription('main', [price.id])
      .quantity(5, price.id)
      .create('pm_card_visa')

    await subscription.swap({ [otherPrice.id]: { quantity: 3 } })

    assert.equal(3, subscription.quantity)
  })

  test('swapping subscription with inline price data', async ({ assert }) => {
    const user = await createCustomer('swapping_subscription_with_inline_price_data')
    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    await subscription.swap([
      {
        price_data: {
          product: product.id,
          tax_behavior: 'exclusive',
          currency: 'EUR',
          recurring: {
            interval: 'month',
          },
          unit_amount: 1100,
        },
      },
    ])

    const stripeSubscription = await subscription.asStripeSubscription()

    assert.equal(stripeSubscription.items.data[0].price.unit_amount, 1100)
    assert.equal(stripeSubscription.items.data[0].price.tax_behavior, 'exclusive')
  })

  test('declined card during new quantity', async ({ assert }) => {
    const user = await createCustomer('declined_card_during_new_quantity')
    const subscription = await user
      .newSubscription('main', [price.id])
      .quantity(5)
      .create('pm_card_visa')

    await user.updateDefaultPaymentMethod('pm_card_chargeCustomerFail')

    try {
      await subscription.incrementAndInvoice(3)
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        assert.isTrue(e.payment.requiresPaymentMethod())
        assert.equal(subscription.quantity, 8)
        assert.isTrue(subscription.pastDue())
      } else {
        throw e
      }
    }
  })

  test('declined card during new quantity for specific price', async ({ assert }) => {
    const user = await createCustomer('declined_card_during_new_quantity_for_specific_price')
    const subscription = await user
      .newSubscription('main', [price.id])
      .quantity(5, price.id)
      .create('pm_card_visa')

    await user.updateDefaultPaymentMethod('pm_card_chargeCustomerFail')

    try {
      await subscription.incrementAndInvoice(3)
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        assert.isTrue(e.payment.requiresPaymentMethod())
        assert.equal(subscription.quantity, 8)
        assert.isTrue(subscription.pastDue())
      } else {
        throw e
      }
    }
  })

  test('declined card during subscribing results in an exception', async ({ assert }) => {
    const user = await createCustomer('declined_card_during_subscribing_results_in_an_exception')

    try {
      await user
        .newSubscription('main', [price.id])
        .quantity(5)
        .create('pm_card_chargeCustomerFail')
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const subscription = await user.subscription('main')

        assert.isTrue(e.payment.requiresPaymentMethod())
        assert.instanceOf(subscription, Subscription)
        assert.isTrue(subscription?.incomplete())
      } else {
        throw e
      }
    }
  })

  test('declined card during subscribing results in an exception', async ({ assert }) => {
    const user = await createCustomer('declined_card_during_subscribing_results_in_an_exception')

    try {
      await user.newSubscription('main', [price.id]).create('pm_card_chargeCustomerFail')
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const subscription = await user.subscription('main')

        assert.isTrue(e.payment.requiresPaymentMethod())
        assert.instanceOf(subscription, Subscription)
        assert.isTrue(subscription?.incomplete())
      } else {
        throw e
      }
    }
  })

  test('next action needed during subscribing results in an exception', async ({ assert }) => {
    const user = await createCustomer(
      'next_action_needed_during_subscribing_results_in_an_exception'
    )

    try {
      await user.newSubscription('main', [price.id]).create('pm_card_threeDSecure2Required')
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const subscription = await user.subscription('main')

        assert.isTrue(e.payment.requiresAction())
        assert.instanceOf(subscription, Subscription)
        assert.isTrue(subscription?.incomplete())
      } else {
        throw e
      }
    }
  })

  test('declined card during price swap results in an exception', async ({ assert }) => {
    const user = await createCustomer('declined_card_during_price_swap_results_in_an_exception')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')
    await user.updateDefaultPaymentMethod('pm_card_chargeCustomerFail')

    try {
      await subscription.swapAndInvoice([premiumPrice.id])
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const sub = await user.subscription('main')

        assert.isTrue(e.payment.requiresPaymentMethod())
        assert.instanceOf(sub, Subscription)
        assert.isTrue(sub?.pastDue())
      } else {
        throw e
      }
    }
  })

  test('next action needed during price swap results in an exception', async ({ assert }) => {
    const user = await createCustomer(
      'next_action_needed_during_price_swap_results_in_an_exception'
    )

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')
    await user.updateDefaultPaymentMethod('pm_card_threeDSecure2Required')

    try {
      await subscription.swapAndInvoice([premiumPrice.id])
      throw new Error('Did not throw')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const sub = await user.subscription('main')

        assert.isTrue(e.payment.requiresAction())
        assert.instanceOf(sub, Subscription)
        assert.isTrue(sub?.pastDue())
      } else {
        throw e
      }
    }
  })

  test('downgrade with faulty card does not incomplete subscription', async ({ assert }) => {
    const user = await createCustomer('downgrade_with_faulty_card_does_not_incomplete_subscription')

    let subscription = await user.newSubscription('main', [premiumPrice.id]).create('pm_card_visa')
    await user.updateDefaultPaymentMethod('pm_card_chargeCustomerFail')
    await subscription.swap(price.id)
    subscription = await subscription.refresh()

    assert.equal(subscription.stripePrice, price.id)
    assert.isTrue(subscription.active())
  })

  test('downgrade with 3d secure does not incomplete subscription', async ({ assert }) => {
    const user = await createCustomer('downgrade_with_3d_secure_does_not_incomplete_subscription')

    let subscription = await user.newSubscription('main', [premiumPrice.id]).create('pm_card_visa')
    await user.updateDefaultPaymentMethod('pm_card_threeDSecure2Required')
    await subscription.swap(price.id)
    subscription = await subscription.refresh()

    assert.equal(subscription.stripePrice, price.id)
    assert.isTrue(subscription.active())
  })

  test('creating subscription with coupons', async ({ assert }) => {
    const user = await createCustomer('creating_subscription_with_coupons')

    const subscription = await user
      .newSubscription('main', [price.id])
      .withCoupon(coupon.id)
      .create('pm_card_visa')

    assert.isTrue(await user.subscribed('main'))
    assert.isTrue(await user.subscribed('main', price.id))
    assert.isFalse(await user.subscribed('main', otherPrice.id))
    assert.isTrue(subscription.active())
    assert.isFalse(subscription.canceled())
    assert.isFalse(subscription.onGracePeriod())
    assert.isTrue(subscription.recurring())
    assert.isFalse(subscription.ended())

    const invoice = await user.invoices().then((i) => i[0])
    const invoiceCoupon = await invoice.discounts().then((d) => d[0].coupon())

    assert.isTrue(invoice.hasDiscount())
    assert.equal(invoice.rawTotal(), 500)
    assert.equal(invoiceCoupon.asStripeCoupon().amount_off, 500)
  })

  test('creating subscription with an anchored billing cycle', async ({ assert }) => {
    const user = await createCustomer('creating_subscription_with_an_anchored_billing_cycle')

    const subscription = await user
      .newSubscription('main')
      .price({
        price_data: {
          product: product.id,
          tax_behavior: 'exclusive',
          currency: 'EUR',
          recurring: {
            interval: 'month',
          },
          unit_amount: 1100,
        },
      })
      .create('pm_card_visa')

    assert.isTrue(await user.subscribed('main'))
    assert.isFalse(await user.subscribed('main', otherPrice.id))
    assert.isTrue(subscription.active())
    assert.isFalse(subscription.canceled())
    assert.isFalse(subscription.onGracePeriod())
    assert.isTrue(subscription.recurring())
    assert.isFalse(subscription.ended())

    const invoice = await user.invoices().then((i) => i[0])

    assert.equal(invoice.rawTotal(), 1100)
    // assert.equal(invoiceCoupon.amount_off, 500)
  })

  test('creating subscription with an anchored billing cycle', async ({ assert }) => {
    const user = await createCustomer('creating_subscription_with_an_anchored_billing_cycle')

    const subscription = await user
      .newSubscription('main', [price.id])
      .anchorBillingCycleOn(DateTime.now().plus({ days: 15 }))
      .create('pm_card_visa')

    assert.isTrue(await user.subscribed('main'))
    assert.isTrue(await user.subscribed('main', price.id))
    assert.isFalse(await user.subscribed('main', otherPrice.id))
    assert.isTrue(subscription.active())
    assert.isFalse(subscription.canceled())
    assert.isFalse(subscription.onGracePeriod())
    assert.isTrue(subscription.recurring())
    assert.isFalse(subscription.ended())

    const invoice = await subscription.invoices().then((i) => i[0])
    const period = await invoice.invoiceItems().then((i) => i[0].period)

    assert.equal(DateTime.fromSeconds(period.start).toISODate(), DateTime.now().toISODate())
    assert.equal(
      DateTime.fromSeconds(period.end).toISODate(),
      DateTime.now().plus({ days: 15 }).toISODate()
    )
  })

  test('creating subscription with trial', async ({ assert }) => {
    const user = await createCustomer('creating_subscription_with_trial')

    const subscription = await user
      .newSubscription('main', [price.id])
      .trialDays(7)
      .create('pm_card_visa')

    assert.isTrue(subscription.active())
    assert.isTrue(subscription.onTrial())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())
    assert.equal(
      await user.getTrialEndsAt('main').then((d) => d?.toISOWeekDate()),
      DateTime.now().plus({ days: 7 }).toISOWeekDate()
    )

    await subscription.cancel()

    assert.isTrue(subscription.active())
    assert.isTrue(subscription.onGracePeriod())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())

    await subscription.resume()

    assert.isTrue(subscription.active())
    assert.isFalse(subscription.onGracePeriod())
    assert.isTrue(subscription.onTrial())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())
    assert.equal(
      await user.getTrialEndsAt('main').then((d) => d?.toISOWeekDate()),
      DateTime.now().plus({ days: 7 }).toISOWeekDate()
    )
  })

  test('user without subscription can return its generic trial end date', async ({ assert }) => {
    const user = new User()

    user.trialEndsAt = DateTime.now().plus({ days: 1 })

    assert.isTrue(user.onGenericTrial())
    assert.equal(user.trialEndsAt.toISOWeekDate(), DateTime.now().plus({ days: 1 }).toISOWeekDate())
  })

  test('user with subscription can return generic trial end date', async ({ assert }) => {
    const user = await createCustomer('user_with_subscription_can_return_generic_trial_end_date')

    user.trialEndsAt = DateTime.now().plus({ days: 1 })

    const subscription = await user.newSubscription('default', [price.id]).create('pm_card_visa')

    assert.isTrue(user.onGenericTrial())
    assert.isTrue(await user.onTrial())
    assert.isFalse(subscription.onTrial())
    assert.equal(
      await user.getTrialEndsAt().then((d) => d?.toISOWeekDate()),
      DateTime.now().plus({ days: 1 }).toISOWeekDate()
    )
  })

  test('creating subscription with explicit trial', async ({ assert }) => {
    const user = await createCustomer('creating_subscription_with_explicit_trial')

    const subscription = await user
      .newSubscription('default', [price.id])
      .trialUntil(DateTime.now().plus({ days: 1, hours: 3, minutes: 15 }))
      .create('pm_card_visa')

    assert.isTrue(subscription.active())
    assert.isTrue(subscription.onTrial())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())
    assert.equal(
      subscription.trialEndsAt?.toISOWeekDate(),
      DateTime.now().plus({ days: 1, hours: 3, minutes: 15 }).toISOWeekDate()
    )

    await subscription.cancel()

    assert.isTrue(subscription.active())
    assert.isTrue(subscription.onGracePeriod())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())

    await subscription.resume()

    assert.isTrue(subscription.active())
    assert.isFalse(subscription.onGracePeriod())
    assert.isTrue(subscription.onTrial())
    assert.isFalse(subscription.recurring())
    assert.isFalse(subscription.ended())
    assert.equal(
      subscription.trialEndsAt?.toISOWeekDate(),
      DateTime.now().plus({ days: 1, hours: 3, minutes: 15 }).toISOWeekDate()
    )
  })

  test('subscription changes can be prorated', async ({ assert }) => {
    const user = await createCustomer('subscription_changes_can_be_prorated')

    const subscription = await user
      .newSubscription('main', [premiumPrice.id])
      .create('pm_card_visa')
    const invoice = await user.invoices().then((i) => i[0])
    const stripeInvoice = invoice.asStripeInvoice() as Stripe.Invoice

    assert.equal(invoice.rawTotal(), 2000)

    await subscription.noProrate().swap(price.id)

    // Assert that no new invoice was created because of no prorating.
    assert.equal(
      await user.invoices().then((i) => (i[0].asStripeInvoice() as Stripe.Invoice).id),
      stripeInvoice.id
    )
    assert.equal(await user.upcomingInvoice().then((i) => i?.rawTotal()), 1000)

    await subscription.swapAndInvoice([premiumPrice.id])

    assert.notEqual(
      await user.invoices().then((i) => (i[0].asStripeInvoice() as Stripe.Invoice).id),
      stripeInvoice.id
    )
    assert.equal(await user.invoices().then((i) => i[0].rawTotal()), 1000)
    assert.equal(await user.upcomingInvoice().then((i) => i?.rawTotal()), 2000)

    await subscription.prorate().swap(price.id)

    // Get back from unused time on premium price on next invoice.
    assert.equal(await user.upcomingInvoice().then((i) => i?.rawTotal()), 0)
  })

  test('trial remains when customer is invoiced immediatly on swap', async ({ assert }) => {
    const user = await createCustomer('trial_remains_when_customer_is_invoiced_immediately_on_swap')

    let subscription = await user
      .newSubscription('main', [price.id])
      .trialDays(5)
      .create('pm_card_visa')

    assert.isTrue(subscription.onTrial())

    subscription = await subscription.swapAndInvoice([otherPrice.id])

    assert.isTrue(subscription.onTrial())
  })

  test('trial on swap is skipped when explicitly asked to', async ({ assert }) => {
    const user = await createCustomer('no_prorate_on_subscription_create')

    let subscription = await user
      .newSubscription('main', [price.id])
      .trialDays(5)
      .create('pm_card_visa')

    assert.isTrue(subscription.onTrial())

    subscription = await subscription.skipTrial().swapAndInvoice([otherPrice.id])

    assert.isFalse(subscription.onTrial())
  })

  test('no prorate on subscription create', async ({ assert }) => {
    const user = await createCustomer('trial_on_swap_is_skipped_when_explicitly_asked_to')

    let subscription = await user
      .newSubscription('main', [price.id])
      .noProrate()
      .createAndSendInvoice(
        {},
        {
          backdate_start_date: DateTime.now().plus({ days: 5, year: -1 }).toUnixInteger(),
          billing_cycle_anchor: DateTime.now().plus({ days: 5 }).toUnixInteger(),
        }
      )

    assert.equal(subscription.stripePrice, price.id)
    assert.isTrue(subscription.active())

    subscription = await subscription.swap([otherPrice.id])

    assert.equal(subscription.stripePrice, otherPrice.id)
    assert.isTrue(subscription.active())
  })

  test('swap and invoice after no prorate with billing cycle anchor delays invoicing', async ({
    assert,
  }) => {
    const user = await createCustomer(
      'swap_and_invoice_after_no_prorate_with_billing_cycle_anchor_delays_invoicing'
    )

    let subscription = await user
      .newSubscription('main', [price.id])
      .noProrate()
      .createAndSendInvoice(
        {},
        {
          backdate_start_date: DateTime.now().plus({ days: 5, year: -1 }).toUnixInteger(),
          billing_cycle_anchor: DateTime.now().plus({ days: 5 }).toUnixInteger(),
        }
      )

    assert.equal(subscription.stripePrice, price.id)
    assert.lengthOf(await user.invoices(), 0)
    assert.equal(await user.upcomingInvoice().then((i) => i?.asStripeInvoice().status), 'draft')
    assert.isTrue(subscription.active())
  })

  test('trials can be extended', async ({ assert }) => {
    const user = await createCustomer('trials_can_be_extended')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    assert.isTrue(subscription.trialEndsAt === undefined || subscription.trialEndsAt === null)

    const endDate = DateTime.now().plus({ days: 5 })
    await subscription.extendTrial(endDate)

    const stripeSubscription = await subscription.asStripeSubscription()

    assert.equal(endDate.toISOWeekDate(), subscription.trialEndsAt?.toISOWeekDate())
    assert.equal(stripeSubscription.trial_end, endDate.toUnixInteger())
  })

  test('trials can be ended', async ({ assert }) => {
    const user = await createCustomer('trials_can_be_ended')

    const subscription = await user
      .newSubscription('main', [price.id])
      .trialDays(10)
      .create('pm_card_visa')

    await subscription.endTrial()

    assert.isTrue(subscription.trialEndsAt === undefined || subscription.trialEndsAt === null)
  })

  test('retrieve the latest payment for a subscription', async ({ assert }) => {
    const user = await createCustomer('retrieve_the_latest_payment_for_a_subscription')

    try {
      await user.newSubscription('main', [price.id]).create('pm_card_threeDSecure2Required')
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        const subscription = await user.subscription('main')
        const payment = await subscription?.latestPayment()

        assert.instanceOf(payment, Payment)
        assert.isTrue(payment?.requiresAction())
      } else {
        throw e
      }
    }
  })

  test('subscription with tax rates can be created', () => {})
  test('suscriptions with options can be created', async ({ assert }) => {
    const user = await createCustomer('subscriptions_with_options_can_be_created')

    const date = DateTime.now().minus({ month: 1 })
    const subscription = await user.newSubscription('main', [price.id]).create(
      'pm_card_visa',
      {},
      {
        backdate_start_date: date.toUnixInteger(),
      }
    )

    const stripeSubscription = await subscription.asStripeSubscription()

    assert.equal(stripeSubscription.start_date, date.toUnixInteger())
  })

  test('new subscription after previous cancellation neams customer is subscribed', async ({
    assert,
  }) => {
    const user = await createCustomer(
      'new_subscription_after_previous_cancellation_means_customer_is_subscribed'
    )

    const subscription = await user.related('subscriptions').create({
      type: 'default',
      stripeId: `sub_1111111111`,
      stripeStatus: 'active',
      stripePrice: 'price_xxx',
      quantity: 1,
      trialEndsAt: null,
      endsAt: null,
    })

    assert.isTrue(await user.subscribed())

    await subscription.markAsCanceled()

    assert.isFalse(await user.subscribed())

    await user.related('subscriptions').create({
      type: 'default',
      stripeId: `sub_1111111112`,
      stripeStatus: 'active',
      stripePrice: 'price_xxx',
      quantity: 1,
      trialEndsAt: null,
      endsAt: null,
    })

    assert.isTrue(await user.subscribed())
  })

  test('subscriptions can be canceled at a specific time', async ({ assert }) => {
    const user = await createCustomer('subscriptions_can_be_canceled_at_a_specific_time')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    const date = DateTime.now().plus({ month: 5 })
    await subscription.cancelAt(date)

    const stripeSubscription = await subscription.asStripeSubscription()

    assert.isTrue(subscription.active())
    assert.equal(subscription.endsAt?.toUnixInteger(), date.toUnixInteger())
    assert.equal(stripeSubscription.cancel_at, date.toUnixInteger())
  })

  test('preview invoice', async ({ assert }) => {
    const user = await createCustomer('subscription_upcoming_invoice')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    const invoice = await subscription.previewInvoice(otherPrice.id)

    assert.equal(invoice?.asStripeInvoice().status, 'draft')
    assert.equal(invoice?.rawTotal(), 1000)
  })

  test('invoice subscription directly', async ({ assert }) => {
    const user = await createCustomer('invoice_subscription_directly')

    const subscription = await user.newSubscription('main', [price.id]).create('pm_card_visa')

    await subscription.updateQuantity(3)

    const invoice = await subscription.invoice()

    assert.equal(invoice.asStripeInvoice().status, 'paid')
    assert.equal(invoice?.rawTotal(), 2000)
  })
})
