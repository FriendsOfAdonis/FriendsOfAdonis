import { Exception } from '@adonisjs/core/exceptions'
import type { ManagesCustomerContract } from '../contracts.js'

export class CustomerAlreadyCreatedError extends Exception {
  static code = 'E_CUSTOMER_ALREADY_CREATED'

  static alreadyCreated(target: ManagesCustomerContract, options?: ErrorOptions) {
    return new CustomerAlreadyCreatedError(
      `'${target.constructor.name}' is already a Stripe customer. See the findOrCreateAsStripeCustomer method.`,
      options
    )
  }
}
