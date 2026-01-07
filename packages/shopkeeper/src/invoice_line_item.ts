import type Stripe from 'stripe'
import { type Invoice } from './invoice.js'

export class InvoiceLineItem {
  #invoice: Invoice
  #item: Stripe.InvoiceLineItem

  constructor(invoice: Invoice, item: Stripe.InvoiceLineItem) {
    Object.assign(this, item)
    this.#invoice = invoice
    this.#item = item
  }

  /**
   * Determine if the invoice line item has tax rates.
   */
  hasTaxRates(): boolean {
    if (this.#invoice.isNotTaxExempt()) {
      return this.#item.tax_amounts.length > 0
    }

    return this.#item.tax_rates.length > 0
  }
}

export interface InvoiceLineItem extends Stripe.InvoiceLineItem {}
