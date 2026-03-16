import { Exception } from '@adonisjs/core/exceptions'
import type Stripe from 'stripe'

export class InvalidPaymentError extends Exception {
  static invalidOwner(paymentMethod: Stripe.PaymentMethod, owner: { stripeId: string | null }) {
    return new InvalidPaymentError(
      `The payment method '${paymentMethod.id}''s customer '${paymentMethod.customer}' does not belong to this customer ${owner.stripeId}`
    )
  }
}
