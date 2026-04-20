import type Stripe from 'stripe'
import { Invoice } from '../invoice.js'
import { checkStripeError } from '../utils/errors.js'
import { InvalidInvoiceError } from '../errors/invalid_invoice.js'
import { Shopkeeper } from '../shopkeeper.js'
import { InvoiceBuilder } from '../builders/invoice_builder.js'
import type {
  HandlesTaxesContract,
  ManagesCustomerContract,
  ManagesInvoicesContract,
} from '../contracts.js'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'

export type ManagesInvoicesClass<
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesInvoicesContract }

export function managesInvoices() {
  return <
    T extends NormalizeConstructor<typeof BaseModel> & {
      new (...args: any[]): ManagesCustomerContract & HandlesTaxesContract
    },
  >(
    superclass: T
  ): ManagesInvoicesClass<T> => {
    class EntityMixin extends superclass {
      /**
       * Begin building a new invoice.
       */
      invoice(): InvoiceBuilder {
        return new InvoiceBuilder(Shopkeeper.$instance, this)
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

        const stripe = Shopkeeper.$instance.stripe

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
          const subs = await stripe.subscriptions.list({
            customer: stripeId,
            limit: 1,
          })
          if (subs.data[0]) {
            options.subscription = subs.data[0].id
          }
        }

        try {
          const invoice = await stripe.invoices.createPreview(options)
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
          const stripe = Shopkeeper.$instance.stripe
          const invoice = await stripe.invoices.retrieve(id)
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

        const stripe = Shopkeeper.$instance.stripe
        const stripeInvoices = await stripe.invoices.list({ customer: stripeId, ...params })

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
