import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import { Payment } from '../../src/payment.js'
import { IncompletePaymentError } from '../../src/errors/incomplete_payment.js'
import shopkeeper from '../../services/shopkeeper.js'

test.group('Charges', () => {
  test('customer can be charged', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_charged')
    await user.createAsStripeCustomer()

    const payment = await user.charge(1000, 'pm_card_visa', {
      return_url: 'https://example.com/return',
    })

    assert.instanceOf(payment, Payment)
    assert.equal(payment.rawAmount(), 1000)
    assert.equal(await payment.customer().then((c) => c?.stripeId), user.stripeId)
  })

  test('non stripe customer can be charged', async ({ assert }) => {
    const user = await createCustomer('non_stripe_customer_can_be_charged')

    const payment = await user.charge(1000, 'pm_card_visa', {
      return_url: 'https://example.com/return',
    })

    assert.instanceOf(payment, Payment)
    assert.equal(payment.rawAmount(), 1000)
    assert.equal(await payment.customer().then((c) => c?.stripeId), user.stripeId)
  })

  test('customer can pay', async ({ assert }) => {
    const user = await createCustomer('customer_can_pay')
    await user.createAsStripeCustomer()

    const payment = await user.pay(1000)

    assert.instanceOf(payment, Payment)
    assert.equal(payment.rawAmount(), 1000)
    assert.equal(await payment.customer().then((c) => c?.stripeId), user.stripeId)
    assert.isTrue(payment.requiresPaymentMethod())
    assert.isTrue(
      await payment.asStripePaymentIntent().then((p) => p.automatic_payment_methods?.enabled)
    )

    const found = await user.findPayment(payment.paymentIntent.id)

    assert.instanceOf(found, Payment)
    assert.equal(found?.paymentIntent.id, payment.paymentIntent.id)
  })

  test('customer can be charged and invoiced immediately', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_charged_and_invoiced_immediately')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    await user.invoice().addItem('Adonis Cloud', 1000).charge()

    const invoice = await user.invoices().then((i) => i[0])
    const items = await invoice.invoiceItems()

    assert.equal(1000, invoice.rawTotal())
    assert.equal(items[0].description, 'Adonis Cloud')
  })

  test('customer can be refunded', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_refunded')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const invoice = await user.invoice().addItem('Adonis Cloud', 1000).charge()
    const stripeInvoice = await shopkeeper.stripe.invoices.retrieve(invoice.asStripeInvoice().id, {
      expand: ['payments.data.payment.payment_intent'],
    })
    const pi = stripeInvoice.payments?.data?.[0]?.payment?.payment_intent
    const piId = typeof pi === 'string' ? pi : pi?.id
    const refund = await user.refund(piId!)

    assert.equal(refund.amount, 1000)
  })

  test('charging may require an extra action', async ({ assert }) => {
    const user = await createCustomer('charging_may_require_an_extra_action')
    await user.createAsStripeCustomer()

    try {
      await user.charge(1000, 'pm_card_threeDSecure2Required', {
        return_url: 'https://example.com/return',
      })
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        assert.isTrue(e.payment.requiresAction())
        assert.equal(e.payment.rawAmount(), 1000)
      } else {
        throw e
      }
    }
  })
})
