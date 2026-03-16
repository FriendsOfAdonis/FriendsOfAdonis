import { Exception } from '@adonisjs/core/exceptions'
import type Stripe from 'stripe'

export class InvalidInvoiceError extends Exception {
  static invalidOwner(invoice: Stripe.Invoice, owner: { stripeId: string | null }) {
    return new InvalidInvoiceError(
      `The invoice '${invoice.id}''s customer '${invoice.customer}' does not belong to this customer ${owner.stripeId}`
    )
  }

  static unauthorizedOwner(id: string, owner: { stripeId?: string | null }) {
    return new InvalidInvoiceError(
      `The customer ${owner.stripeId} is not authorized to retrieve the invoice '${id}'`,
      { code: '403' }
    )
  }

  static notFound(id: string) {
    return new InvalidInvoiceError(`The invoice '${id}' does not exist`, { code: '404' })
  }
}
