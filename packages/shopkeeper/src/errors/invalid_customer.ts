import { Exception } from '@adonisjs/core/exceptions'
import { type ManagesStripeContract } from '../contracts.js'

export class InvalidCustomerError extends Exception {
  static code = 'E_INVALID_CUSTOMER'

  static notYetCreated(target: ManagesStripeContract, options?: ErrorOptions) {
    return new InvalidCustomerError(
      `'${target.constructor.name}' is not a Stripe customer yet. See the createAsStripeCustomer method.`,
      options
    )
  }
}
