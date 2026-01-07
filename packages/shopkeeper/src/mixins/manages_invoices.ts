import type Stripe from 'stripe'
import { type WithManagesCustomer } from './manages_customer.js'
import { Invoice } from '../invoice.js'
import { Exception } from '@adonisjs/core/exceptions'
import { Payment } from '../payment.js'
import shopkeeper from '../../services/shopkeeper.js'
import { checkStripeError } from '../utils/errors.js'
import { type WithHandlesTaxes } from './handles_taxes.js'
import { InvalidInvoiceError } from '../errors/invalid_invoice.js'
import { type NormalizeConstructor } from '@poppinss/utils/types'

type Constructor = NormalizeConstructor<WithHandlesTaxes & WithManagesCustomer>

type TabItemParams = Partial<
  Omit<Stripe.InvoiceItemCreateParams, 'price_data'> & {
    price_data?: Omit<Stripe.InvoiceItemCreateParams.PriceData, 'currency'> & { currency?: string }
  }
>

export function ManagesInvoices<Model extends Constructor>(superclass: Model) {
  return class WithManagesInvoicesImpl extends superclass {
    /**
     * Add an invoice item to the customer's upcoming invoice.
     */
    tab(
      description: string,
      amount?: number,
      params: TabItemParams = {}
    ): Promise<Stripe.InvoiceItem> {
      if (this.isAutomaticTaxEnabled() && !params?.price_data) {
        throw new Exception(
          'When using automatic tax calculation, you must include "price_data" in the provided options array.'
        )
      }

      const stripeId = this.stripeIdOrFail()
      const options: TabItemParams = {
        customer: stripeId,
        currency: this.preferredCurrency(),
        description,
        ...params,
      }

      if (options.price_data) {
        options.price_data = {
          unit_amount: amount,
          currency: this.preferredCurrency(),
          ...options.price_data,
        }
      } else if (options.quantity && !options.unit_amount) {
        options.unit_amount = amount
      } else {
        options.amount = amount
      }

      return this.stripe.invoiceItems.create(options as Stripe.InvoiceItemCreateParams)
    }

    /**
     * Invoice the customer for the given Price ID and generate an invoice immediately.
     */
    async invoiceFor(
      description: string,
      amount: number,
      tabParams: TabItemParams = {},
      invoiceParams: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams = {}
    ): Promise<Invoice> {
      await this.tab(description, amount, tabParams)
      return this.invoice(invoiceParams)
    }

    /**
     * Add an invoice item for a specific Price ID to the customer's upcoming invoice.
     */
    async tabPrice(
      price: string,
      quantity = 1,
      params: Partial<Stripe.InvoiceItemCreateParams> = {}
    ): Promise<Stripe.InvoiceItem> {
      const stripeId = this.stripeIdOrFail()

      return this.stripe.invoiceItems.create({
        customer: stripeId,
        price,
        quantity,
        ...params,
      })
    }

    /**
     * Invoice the customer for the given Price ID and generate an invoice immediately.
     */
    async invoicePrice(
      price: string,
      quantity = 1,
      tabParams: Partial<Stripe.InvoiceItemCreateParams> = {},
      invoiceParams: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams = {}
    ): Promise<Invoice> {
      await this.tabPrice(price, quantity, tabParams)
      return this.invoice(invoiceParams)
    }

    /**
     * Invoice the customer outside of the regular billing cycle.
     */
    async invoice(
      params: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams = {}
    ): Promise<Invoice> {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { forgive, mandate, off_session, payment_method, source, ...createParams } = params

      const invoice = await this.createInvoice({
        pending_invoice_items_behavior: 'include',
        ...createParams,
      })

      try {
        invoice.chargesAutomatically()
          ? await invoice.pay({
              forgive,
              mandate,
              off_session,
              payment_method,
              source,
            })
          : await invoice.send()

        return invoice
      } catch (e) {
        const err = e as Stripe.errors.StripeError
        if (err.type !== 'StripeCardError') {
          throw err
        }

        await invoice.refresh()

        const pi = await this.stripe.paymentIntents.retrieve(
          invoice.asStripeInvoice().payment_intent as string,
          { expand: ['invoice.subscription'] }
        )

        const payment = new Payment(pi)
        payment.validate()
        return invoice
      }
    }

    /**
     * Create an invoice within Stripe.
     */
    async createInvoice(params: Stripe.InvoiceCreateParams = {}): Promise<Invoice> {
      const customer = await this.asStripeCustomer()
      const options: Stripe.InvoiceCreateParams = {
        automatic_tax: this.automaticTaxPayload() as Stripe.InvoiceCreateParams.AutomaticTax, // TODO: Fix type
        customer: customer.id,
        currency: customer.currency ?? shopkeeper.currency,
        ...params,
      }

      if (options.subscription) {
        options.currency = undefined
      }

      const invoice = await this.stripe.invoices.create(options)
      return new Invoice(this, invoice)
    }

    /**
     * Get the customer's upcoming invoice.
     */
    async upcomingInvoice(
      params: Stripe.InvoiceRetrieveUpcomingParams = {}
    ): Promise<Invoice | null> {
      const stripeId = this.stripeIdOrFail()
      const options: Stripe.InvoiceRetrieveUpcomingParams = {
        automatic_tax:
          this.automaticTaxPayload() as Stripe.InvoiceRetrieveUpcomingParams.AutomaticTax,
        customer: stripeId,
        ...params,
      }

      try {
        const invoice = await this.stripe.invoices.retrieveUpcoming(options)
        return new Invoice(this, invoice)
      } catch (e) {
        checkStripeError(e, 'StripeInvalidRequestError')
      }

      return null
    }

    /**
     * Find an invoice by ID.
     */
    async findInvoice(id: string): Promise<Invoice | null> {
      try {
        const invoice = await this.stripe.invoices.retrieve(id)
        return new Invoice(this, invoice)
      } catch (e) {
        checkStripeError(e, 'StripeInvalidRequestError')
        return null
      }
    }

    /**
     * Find an invoice or throw a 404 or 403 error.
     */
    async findInvoiceOrFail(id: string): Promise<Invoice> {
      let invoice: Invoice | null
      try {
        invoice = await this.findInvoice(id)
      } catch (e) {
        if (e instanceof InvalidInvoiceError) {
          throw InvalidInvoiceError.unauthorizedOwner(id, this)
        }

        throw e
      }

      if (!invoice) {
        throw InvalidInvoiceError.notFound(id) // TODO: Error
      }

      return invoice
    }

    /**
     * Get a collection of the customer's invoices.
     */
    async invoices(
      includePending = false,
      params: Stripe.InvoiceListParams = {}
    ): Promise<Invoice[]> {
      const stripeId = this.stripeIdOrFail()

      const invoices = []

      const stripeInvoices = await this.stripe.invoices.list({ customer: stripeId, ...params })

      for (const invoice of stripeInvoices.data) {
        if (invoice.paid || includePending) {
          invoices.push(new Invoice(this, invoice))
        }
      }

      return invoices
    }

    /**
     * Get an array of the customer's invoices, including pending invoices.
     */
    invoicesIncludingPending(params: Stripe.InvoiceListParams = {}): Promise<Invoice[]> {
      return this.invoices(true, params)
    }
  }
}

export type WithManagesInvoices = ReturnType<typeof ManagesInvoices>
