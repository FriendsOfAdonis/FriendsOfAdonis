import type Stripe from 'stripe'
import { Shopkeeper } from '../shopkeeper.js'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import { BaseListener } from './base_listener.js'

@inject()
export default class StripeCustomerSubscriptionCreatedListener extends BaseListener {
  constructor(private shopkeeper: Shopkeeper) {
    super()
  }

  async handle(payload: Stripe.CustomerSubscriptionCreatedEvent) {
    const user = await this.shopkeeper.findBillable(payload.data.object.customer)

    if (!user) return

    await user.load('subscriptions')

    const data = payload.data.object
    if (!user.subscriptions.some((s) => s.stripeId === data.id)) {
      const trialEndsAt = data.trial_end ? DateTime.fromSeconds(data.trial_end) : undefined
      const firstItem = data.items.data[0]
      const isSinglePrice = data.items.data.length === 1

      const subscription = await user.related('subscriptions').create({
        type: data.metadata?.type ?? data.metadata?.name ?? 'default',
        stripeId: data.id,
        stripeStatus: data.status,
        ...(isSinglePrice && {
          stripePrice: firstItem.price.id,
          quantity: firstItem.quantity,
        }),
        trialEndsAt,
        endsAt: null,
      })

      await subscription.related('items').createMany(
        data.items.data.map((item) => ({
          stripeId: item.id,
          stripeProduct: item.price.product as string,
          stripePrice: item.price.id,
          quantity: item.quantity,
        }))
      )
      if (user.trialEndsAt) {
        user.trialEndsAt = null
        await user.save()
      }
    }
  }
}
