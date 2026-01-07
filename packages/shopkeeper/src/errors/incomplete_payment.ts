import { Exception } from '@adonisjs/core/exceptions'
import { type Payment } from '../payment.js'

export class IncompletePaymentError extends Exception {
  payment: Payment

  constructor(payment: Payment, ...args: ConstructorParameters<typeof Exception>) {
    super(...args)
    this.payment = payment
  }

  static paymentMethodRequired(payment: Payment) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because of an invalid payment method.'
    )
  }

  static requiresAction(payment: Payment) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because additional action is required before it can be completed.'
    )
  }

  static requiresConfirmation(payment: Payment) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because it needs to be confirmed before it can be completed.'
    )
  }
}
