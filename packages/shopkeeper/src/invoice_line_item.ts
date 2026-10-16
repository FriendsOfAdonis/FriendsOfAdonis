import type Stripe from 'stripe'
import { type Invoice } from './invoice.js'

export class InvoiceLineItem {
  #item: Stripe.InvoiceLineItem

  constructor(_invoice: Invoice, item: Stripe.InvoiceLineItem) {
    Object.assign(this, item)
    this.#item = item
  }

  /**
   * Determine if the invoice line item has tax rates.
   */
  hasTaxRates(): boolean {
    return (this.#item.taxes ?? []).length > 0
  }
}

export interface InvoiceLineItem extends Stripe.InvoiceLineItem {}
