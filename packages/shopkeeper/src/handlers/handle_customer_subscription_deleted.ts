import type Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'

export async function handleCustomerSubscriptionDeleted(
  payload: Stripe.CustomerSubscriptionDeletedEvent
) {
  const user = await shopkeeper.findBillable(payload.data.object.customer)
  if (!user) return

  const subscription = await user
    .related('subscriptions')
    .query()
    .where('stripeId', payload.data.object.id)
    .first()
  if (!subscription) return

  await subscription.skipTrial().markAsCanceled()
}
