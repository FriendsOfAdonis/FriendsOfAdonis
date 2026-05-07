import { Exception } from '@adonisjs/core/exceptions'
import { type Payment } from '../payment.js'

export class IncompletePaymentError extends Exception {
  static code = 'E_INCOMPLETE_PAYMENT'

  payment: Payment

  constructor(payment: Payment, ...args: ConstructorParameters<typeof Exception>) {
    super(...args)
    this.payment = payment
  }

  static paymentMethodRequired(payment: Payment, options?: ErrorOptions) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because of an invalid payment method.',
      options
    )
  }

  static requiresAction(payment: Payment, options?: ErrorOptions) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because additional action is required before it can be completed.',
      options
    )
  }

  static requiresConfirmation(payment: Payment, options?: ErrorOptions) {
    return new IncompletePaymentError(
      payment,
      'The payment attempt failed because it needs to be confirmed before it can be completed.',
      options
    )
  }
}
