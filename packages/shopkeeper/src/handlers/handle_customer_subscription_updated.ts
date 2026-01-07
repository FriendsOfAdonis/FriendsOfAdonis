import type Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'
import { DateTime } from 'luxon'

export async function handleCustomerSubscriptionUpdated(
  payload: Stripe.CustomerSubscriptionUpdatedEvent
) {
  const user = await shopkeeper.findBillable(payload.data.object.customer)

  if (!user) return

  const data = payload.data.object
  let subscription = await user.related('subscriptions').query().where('stripeId', data.id).first()
  if (!subscription) {
    subscription = new shopkeeper.subscriptionModel()
    subscription.stripeId = data.id
  }

  if (data.status === 'incomplete_expired') {
    await subscription.related('items').query().delete()
    await subscription.delete()
    return
  }

  subscription.type = subscription.type ?? data.metadata?.type ?? data.metadata?.name ?? 'default'

  const firstItem = data.items.data[0]
  const isSinglePrice = data.items.data.length === 1

  subscription.stripePrice = isSinglePrice ? firstItem.price.id : null
  subscription.quantity = isSinglePrice ? firstItem.quantity || null : null

  if (data.trial_end) {
    const trialEnd = DateTime.fromSeconds(data.trial_end)
    if (!subscription.trialEndsAt) {
      subscription.trialEndsAt = trialEnd
    }
  }

  if (data.cancel_at_period_end) {
    subscription.endsAt = subscription.onTrial()
      ? subscription.trialEndsAt
      : DateTime.fromSeconds(data.current_period_end)
  } else if (data.cancel_at || data.canceled_at) {
    subscription.endsAt = DateTime.fromSeconds(data.cancel_at! ?? data.canceled_at!)
  } else {
    subscription.endsAt = null
  }

  subscription.stripeStatus = data.status ?? subscription.stripeStatus

  await subscription.save()

  if (!data.items) return

  const subscriptionItemIds = []
  for (const item of data.items.data) {
    subscriptionItemIds.push(item.id)
    await subscription.related('items').updateOrCreate(
      { stripeId: item.id },
      {
        stripeProduct: item.price.product as string,
        stripePrice: item.price.id,
        quantity: item.quantity,
      }
    )
  }

  await subscription.related('items').query().delete().whereNotIn('stripeId', subscriptionItemIds)
}
