import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import { PaymentMethod } from '../../src/payment_method.js'
import { createApp } from '../app.js'

test.group('PaymentMethods', () => {
  test('we can start a new setup intent session', async ({ assert }) => {
    const user = await createCustomer('we_can_start_a_new_setup_intent_session')
    const setupIntent = await user.createSetupIntent()
    assert.equal(setupIntent.object, 'setup_intent')
  })

  test('we can retrieve a setup intent', async ({ assert }) => {
    const user = await createCustomer('we_can_retrieve_a_setup_intent')
    const original = await user.createSetupIntent()
    const retrieved = await user.findSetupIntent(original.id)
    assert.equal(retrieved.id, original.id)
  })

  test('we can add payment methods', async ({ assert }) => {
    const user = await createCustomer('we_can_add_payment_methods')
    await user.createAsStripeCustomer()

    const paymentMethod = await user.addPaymentMethod('pm_card_visa')

    assert.instanceOf(paymentMethod, PaymentMethod)
    assert.equal(paymentMethod.card?.brand, 'visa')
    assert.equal(paymentMethod.card?.last4, '4242')
    assert.isTrue(await user.hasPaymentMethod())
    assert.isFalse(user.hasDefaultPaymentMethod())
  })

  test('we can add default sepa payment method', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('we_can_add_default_sepa_payment_method')
    await user.createAsStripeCustomer()

    const pm = await shopkeeper.stripe.paymentMethods.create({
      type: 'sepa_debit',
      billing_details: {
        name: 'Schwarzy',
        email: 'schwarzy@example.com',
      },
      sepa_debit: {
        iban: 'BE62510007547061',
      },
    })

    const paymentMethod = await user.updateDefaultPaymentMethod(pm.id)

    assert.instanceOf(paymentMethod, PaymentMethod)
    assert.equal(user.pmType, 'sepa_debit')
    assert.equal(user.pmLastFour, '7061')
    assert.equal(paymentMethod.type, 'sepa_debit')
    assert.equal(paymentMethod.sepa_debit?.last4, '7061')
    assert.isTrue(await user.hasPaymentMethod('sepa_debit'))
    assert.isTrue(user.hasDefaultPaymentMethod())
  })

  test('we can delete the default payment method', async ({ assert }) => {
    const user = await createCustomer('we_can_delete_the_default_payment_method')
    await user.createAsStripeCustomer()

    const paymentMethod = await user.updateDefaultPaymentMethod('pm_card_visa')

    assert.lengthOf(await user.paymentMethods(), 1)
    assert.isTrue(await user.hasPaymentMethod())
    assert.isTrue(user.hasDefaultPaymentMethod())

    await user.deletePaymentMethod(paymentMethod.asStripePaymentMethod())

    assert.lengthOf(await user.paymentMethods(), 0)
    assert.isNull(await user.defaultPaymentMethod())
    assert.isTrue(user.pmType === undefined || user.pmType === null)
    assert.isTrue(user.pmLastFour === undefined || user.pmLastFour === null)

    assert.isFalse(await user.hasPaymentMethod())
    assert.isFalse(user.hasDefaultPaymentMethod())
  })

  test('we can set a default payment method', async ({ assert }) => {
    const user = await createCustomer('we_can_set_a_default_payment_method')
    await user.createAsStripeCustomer()

    const paymentMethod = await user.updateDefaultPaymentMethod('pm_card_visa')

    assert.instanceOf(paymentMethod, PaymentMethod)
    assert.equal(paymentMethod.card?.brand, 'visa')
    assert.equal(paymentMethod.card?.last4, '4242')
    assert.isTrue(user.hasDefaultPaymentMethod())

    const found = await user.defaultPaymentMethod()
    assert.instanceOf(found, PaymentMethod)
    assert.equal(paymentMethod.card?.brand, 'visa')
    assert.equal(paymentMethod.card?.last4, '4242')
  })

  test('we can retrieve all payment methods', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('we_can_retrieve_all_payment_methods')
    const customer = await user.createAsStripeCustomer()

    let paymentMethod = await shopkeeper.stripe.paymentMethods.retrieve('pm_card_visa')
    await shopkeeper.stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    paymentMethod = await shopkeeper.stripe.paymentMethods.retrieve('pm_card_mastercard')
    await shopkeeper.stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    const paymentMethods = await user.paymentMethods()

    assert.lengthOf(paymentMethods, 2)
  })

  test('we can sync default payment method from stripe', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('we_can_retrieve_all_payment_methods')
    const customer = await user.createAsStripeCustomer()

    let paymentMethod = await shopkeeper.stripe.paymentMethods.retrieve('pm_card_visa')
    await shopkeeper.stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    await shopkeeper.stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    })

    assert.isUndefined(user.pmType)
    assert.isUndefined(user.pmLastFour)

    await user.updateDefaultPaymentMethodFromStripe()

    assert.equal(user.pmType, 'visa')
    assert.equal(user.pmLastFour, '4242')
  })

  test('we can delete all payment methods', async ({ assert }) => {
    const { shopkeeper } = await createApp()
    const user = await createCustomer('we_delete_all_payment_methods')
    const customer = await user.createAsStripeCustomer()

    let paymentMethod = await shopkeeper.stripe.paymentMethods.retrieve('pm_card_visa')
    await shopkeeper.stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    paymentMethod = await shopkeeper.stripe.paymentMethods.retrieve('pm_card_mastercard')
    await shopkeeper.stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    let paymentMethods = await user.paymentMethods()
    assert.lengthOf(paymentMethods, 2)

    await user.deletePaymentMethods()

    paymentMethods = await user.paymentMethods()
    assert.lengthOf(paymentMethods, 0)
  })
})
