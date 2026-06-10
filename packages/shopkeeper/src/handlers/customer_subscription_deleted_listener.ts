import type Stripe from 'stripe'
import { Shopkeeper } from '../shopkeeper.js'
import { inject } from '@adonisjs/core'
import { BaseListener } from './base_listener.js'

@inject()
export default class StripeCustomerSubscriptionDeletedListener extends BaseListener {
  constructor(private shopkeeper: Shopkeeper) {
    super()
  }

  async handle(payload: Stripe.CustomerSubscriptionDeletedEvent) {
    const user = await this.shopkeeper.findBillable(payload.data.object.customer)
    if (!user) return

    const subscription = await user
      .related('subscriptions')
      .query()
      .where('stripeId', payload.data.object.id)
      .first()
    if (!subscription) return

    await subscription.skipTrial().markAsCanceled()
  }
}
