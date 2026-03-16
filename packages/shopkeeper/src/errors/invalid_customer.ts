import { Exception } from '@adonisjs/core/exceptions'
import { type ManagesStripeRow } from '../mixins/manages_stripe.js'

export class InvalidCustomerError extends Exception {
  static notYetCreated(target: ManagesStripeRow) {
    return new InvalidCustomerError(
      `'${target.constructor.name}' is not a Stripe customer yet. See the createAsStripeCustomer method.`
    )
  }
}
