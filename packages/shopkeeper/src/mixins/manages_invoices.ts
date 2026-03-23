import type Stripe from 'stripe'
import { Invoice } from '../invoice.js'
import { Exception } from '@adonisjs/core/exceptions'
import { Payment } from '../payment.js'
import app from '@adonisjs/core/services/app'
import { checkStripeError } from '../utils/errors.js'
import { InvalidInvoiceError } from '../errors/invalid_invoice.js'
import type { ManagesCustomerContract, ManagesInvoicesContract } from '../contracts.js'
import type { HandlesTaxesRow } from './handles_taxes.js'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'

type TabItemParams = Partial<
  Omit<Stripe.InvoiceItemCreateParams, 'price_data'> & {
    price_data?: Omit<Stripe.InvoiceItemCreateParams.PriceData, 'currency'> & { currency?: string }
  }
>

export type ManagesInvoicesClass<
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesInvoicesContract }

export function managesInvoices() {
  return <
    T extends NormalizeConstructor<typeof BaseModel> & {
      new (...args: any[]): ManagesCustomerContract & HandlesTaxesRow
    },
  >(
    superclass: T
  ): ManagesInvoicesClass<T> => {
    class EntityMixin extends superclass {
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
        const { price_data: inputPriceData, ...restParams } = params

        const options: Stripe.InvoiceItemCreateParams = {
          customer: stripeId,
          currency: this.preferredCurrency(),
          description,
          ...restParams,
        }

        if (inputPriceData) {
          options.price_data = {
            unit_amount: amount,
            currency: this.preferredCurrency(),
            ...inputPriceData,
          }
        } else if (options.quantity && !options.unit_amount_decimal) {
          options.unit_amount_decimal =
            amount !== null && amount !== undefined ? String(amount) : undefined
        } else {
          options.amount = amount
        }

        return this.stripe.invoiceItems.create(options)
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
          pricing: { price },
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
          const err = checkStripeError(e, 'StripeCardError')

          await invoice.refresh()

          if (err.payment_intent) {
            const payment = new Payment(err.payment_intent)
            payment.validate()
          }

          return invoice
        }
      }

      /**
       * Create an invoice within Stripe.
       */
      async createInvoice(params: Stripe.InvoiceCreateParams = {}): Promise<Invoice> {
        const customer = await this.asStripeCustomer()
        const options: Stripe.InvoiceCreateParams = {
          automatic_tax: this.automaticTaxPayload(),
          customer: customer.id,
          currency: customer.currency ?? app.config.get('shopkeeper.currency'),
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
        params: Stripe.InvoiceCreatePreviewParams = {}
      ): Promise<Invoice | null> {
        const stripeId = this.stripeIdOrFail()
        const options: Stripe.InvoiceCreatePreviewParams = {
          automatic_tax: this.automaticTaxPayload(),
          customer: stripeId,
          ...params,
        }

        // createPreview requires at least one of: subscription, schedule,
        // subscription_details.items, schedule_details.phases, or invoice_items.
        // Auto-detect the customer's subscription if none is provided.
        if (
          !options.subscription &&
          !options.subscription_details?.items &&
          !options.schedule &&
          !options.schedule_details?.phases &&
          !options.invoice_items
        ) {
          const subs = await this.stripe.subscriptions.list({
            customer: stripeId,
            limit: 1,
          })
          if (subs.data[0]) {
            options.subscription = subs.data[0].id
          }
        }

        try {
          const invoice = await this.stripe.invoices.createPreview(options)
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
          throw InvalidInvoiceError.notFound(id)
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
          if (invoice.status === 'paid' || includePending) {
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

    return EntityMixin
  }
}

export type WithManagesInvoices = ReturnType<ReturnType<typeof managesInvoices>>
