import { Exception } from '@adonisjs/core/exceptions'
import type Stripe from 'stripe'
import { type ManagesStripeContract } from '../contracts.js'

export class InvalidPaymentError extends Exception {
  static code = 'E_INVALID_PAYMENT'

  static invalidOwner(
    paymentMethod: Stripe.PaymentMethod,
    owner: ManagesStripeContract,
    options?: ErrorOptions
  ) {
    return new InvalidPaymentError(
      `The payment method '${paymentMethod.id}''s customer '${paymentMethod.customer}' does not belong to this customer ${owner.stripeId}`,
      options
    )
  }
}
