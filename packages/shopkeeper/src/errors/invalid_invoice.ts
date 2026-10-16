import { Exception } from '@adonisjs/core/exceptions'
import type Stripe from 'stripe'
import { type ManagesStripeContract } from '../contracts.js'

export class InvalidInvoiceError extends Exception {
  static invalidOwner(
    invoice: Stripe.Invoice,
    owner: ManagesStripeContract,
    options?: ErrorOptions
  ) {
    return new InvalidInvoiceError(
      `The invoice '${invoice.id}''s customer '${invoice.customer}' does not belong to this customer ${owner.stripeId}`,
      options
    )
  }

  static unauthorizedOwner(
    id: string,
    owner: ManagesStripeContract,
    options?: Omit<ErrorOptions, 'code'>
  ) {
    return new InvalidInvoiceError(
      `The customer ${owner.stripeId} is not authorized to retrieve the invoice '${id}'`,
      { code: '403', ...options }
    )
  }

  static notFound(id: string, options?: Omit<ErrorOptions, 'code'>) {
    return new InvalidInvoiceError(`The invoice '${id}' does not exist`, {
      code: '404',
      ...options,
    })
  }
}
