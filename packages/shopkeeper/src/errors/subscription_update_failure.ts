import { Exception } from '@adonisjs/core/exceptions'
import type Subscription from '../models/subscription.js'

export class SubscriptionUpdateFailureError extends Exception {
  static code = 'E_SUBSCRIPTION_UPDATE_FAILURE'

  static incompleteSubscription(subscription: Subscription, options?: ErrorOptions) {
    return new SubscriptionUpdateFailureError(
      `The subscription '${subscription.stripeId}' cannot be updated because its payment is incomplete.`,
      options
    )
  }

  static duplicatePrice(subscription: Subscription, price: string, options?: ErrorOptions) {
    return new SubscriptionUpdateFailureError(
      `The price "${price}" is already attached to subscription "${subscription.stripeId}".`,
      options
    )
  }

  static cannotRemoveLastPrice(subscription: Subscription, options?: ErrorOptions) {
    return new SubscriptionUpdateFailureError(
      `The subscription "${subscription.stripeId}" must have at least one price.`,
      options
    )
  }
}
