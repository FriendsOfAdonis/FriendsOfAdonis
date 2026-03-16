import type Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'
import { DateTime } from 'luxon'

export async function handleCustomerSubscriptionCreated(
  payload: Stripe.CustomerSubscriptionCreatedEvent
) {
  const user = await shopkeeper.findBillable(payload.data.object.customer)

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
  }

  if (user.trialEndsAt) {
    user.trialEndsAt = null
    await user.save()
  }
}
