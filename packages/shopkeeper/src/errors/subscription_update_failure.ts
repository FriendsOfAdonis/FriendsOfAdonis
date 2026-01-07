import { Exception } from '@adonisjs/core/exceptions'
import type Subscription from '../models/subscription.js'

export class SubscriptionUpdateFailureError extends Exception {
  static incompleteSubscription(subscription: Subscription) {
    return new SubscriptionUpdateFailureError(
      `The subscription '${subscription.stripeId}' cannot be updated because its payment is incomplete.`
    )
  }

  static duplicatePrice(subscription: Subscription, price: string) {
    return new SubscriptionUpdateFailureError(
      `The price "${price}" is already attached to subscription "${subscription.stripeId}".`
    )
  }
}
