import type Stripe from 'stripe'

export abstract class BaseListener<T extends Stripe.Event = Stripe.Event> {
  abstract handle(payload: T): Promise<void>
}
