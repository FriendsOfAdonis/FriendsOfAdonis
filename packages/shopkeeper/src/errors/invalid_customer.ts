import { Exception } from '@adonisjs/core/exceptions'
import { type WithManagesStripe } from '../mixins/manages_stripe.js'

export class InvalidCustomerError extends Exception {
  static notYetCreated(target: WithManagesStripe['prototype']) {
    return new InvalidCustomerError(
      `'${target.constructor.name}' is not a Stripe customer yet. See the createAsStripeCustomer method.`
    )
  }
}
