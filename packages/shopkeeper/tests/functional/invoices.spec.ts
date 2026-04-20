import { test } from '@japa/runner'
import { createCustomer } from '../utils.js'
import { InvalidCustomerError } from '../../src/errors/invalid_customer.js'
import { Shopkeeper } from '../../src/shopkeeper.js'
import { Invoice } from '../../src/invoice.js'
import type Stripe from 'stripe'
import { InvalidInvoiceError } from '../../src/errors/invalid_invoice.js'

test.group('Invoices', () => {
  test('require stripe customer for invoices', async ({ expect }) => {
    const user = await createCustomer('require_stripe_customer_for_invoicing')

    await expect(user.invoice().create()).rejects.toThrow(InvalidCustomerError)
  })

  test('invoices can be created', async ({ assert }) => {
    const user = await createCustomer('invoices_can_be_created')
    await user.createAsStripeCustomer()

    const invoice = await user.invoice().draft()

    assert.instanceOf(invoice, Invoice)
    assert.equal(invoice.rawTotal(), 0)

    await invoice.addItem('Adonis Pin', 10000)

    assert.equal(invoice.rawTotal(), 10000)
  })

  test('customer can be invoiced', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_invoiced')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const invoice = await user.invoice().addItem('Adonis Pin', 12000).pay()

    assert.instanceOf(invoice, Invoice)
    assert.equal(invoice.rawTotal(), 12000)
  })

  test('customer can be invoiced with a price', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_invoiced')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const stripe = Shopkeeper.$instance.stripe
    const price = await stripe.prices.create({
      currency: user.preferredCurrency(),
      product_data: {
        name: 'Koala',
      },
      unit_amount: 8000,
    })

    const invoice = await user.invoice().addPrice(price.id, 2).pay()

    assert.instanceOf(invoice, Invoice)
    assert.equal(invoice.rawTotal(), 16000)
  })

  test('customer can be invoice with inline price data', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_invoiced_with_inline_price_data')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const stripe = Shopkeeper.$instance.stripe
    const product = await stripe.products.create({
      name: 'Fixing bugs',
      type: 'service',
    })

    const invoice = await user
      .invoice()
      .addItem('Fixing bugs', 50000, {
        price_data: {
          product: product.id,
          tax_behavior: 'exclusive',
        },
      })
      .pay()

    assert.instanceOf(invoice, Invoice)
    assert.equal(invoice.rawTotal(), 50000)
    assert.equal(
      await invoice.invoiceLineItems().then((l: any[]) => {
        const price = l[0].pricing?.price_details?.price
        return typeof price === 'object' ? price?.tax_behavior : undefined
      }),
      'exclusive'
    )
  })

  test('find invoice by id', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_invoiced_with_inline_price_data')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')
    let invoice = await user.invoice().addItem('Fishing', 2000).pay()

    const stripeInvoice = invoice.asStripeInvoice() as Stripe.Invoice

    const found = await user.findInvoice(stripeInvoice.id)
    assert.instanceOf(found, Invoice)
    assert.equal(found?.rawTotal(), 2000)
  })

  test('it throws an exception if the invoice does not belong to the user', async ({ expect }) => {
    const user = await createCustomer(
      'it_throws_an_exception_if_the_invoice_does_not_belong_to_the_user'
    )
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const otherUser = await createCustomer(
      'it_throws_an_exception_if_the_invoice_does_not_belong_to_the_user2'
    )
    await otherUser.createAsStripeCustomer()
    await otherUser.updateDefaultPaymentMethod('pm_card_visa')

    const invoice = await user.invoice().addItem('Fishing', 2000).pay()

    await expect(
      otherUser.findInvoice((invoice.asStripeInvoice() as Stripe.Invoice).id)
    ).rejects.toThrow(InvalidInvoiceError)
  })

  test('find invoice by id or faild', async ({ assert }) => {
    const user = await createCustomer('find_invoice_by_id_or_fail')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const otherUser = await createCustomer(
      'it_throws_an_exception_if_the_invoice_does_not_belong_to_the_user2'
    )
    await otherUser.createAsStripeCustomer()
    await otherUser.updateDefaultPaymentMethod('pm_card_visa')

    const invoice = await user.invoice().addItem('Fishing', 2000).pay()

    try {
      await otherUser.findInvoiceOrFail((invoice.asStripeInvoice() as Stripe.Invoice).id)
    } catch (e: any) {
      assert.instanceOf(e, InvalidInvoiceError)
      assert.equal(e.code, '403')
    }
  })

  test('customer can be invoiced with quantity', async ({ assert }) => {
    const user = await createCustomer('customer_can_be_invoiced_with_quantity')
    await user.createAsStripeCustomer()
    await user.updateDefaultPaymentMethod('pm_card_visa')

    const invoice = await user.invoice().addItem('Crying', 2000, { quantity: 5 }).pay()

    assert.instanceOf(invoice, Invoice)
    assert.equal(invoice.rawTotal(), 10000)

    const draftInvoice = await user.invoice().draft()
    await draftInvoice.addItem('Shouting', 1000)

    // Tab on existing invoice uses Stripe directly now
    const items = await draftInvoice.invoiceLineItems()
    assert.equal(items[0].description, 'Shouting')
  })
})
