import type Stripe from 'stripe'

type NarrowedStripeError<T extends Stripe.errors.StripeError['type']> =
  Stripe.errors.StripeError & {
    type: T
  }

/**
 * Type predicate to check if an unknown error is a Stripe error of a specific type.
 */
function isStripeErrorOfType<T extends Stripe.errors.StripeError['type']>(
  err: unknown,
  type: T
): err is NarrowedStripeError<T> {
  return (
    err !== null &&
    err !== undefined &&
    typeof err === 'object' &&
    'type' in err &&
    err.type === type
  )
}

/**
 * Type predicate to check if an unknown value is a Stripe Event.
 */
export function isStripeEvent(event: unknown): event is Stripe.Event {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    typeof event.type === 'string' &&
    'data' in event &&
    typeof event.data === 'object' &&
    event.data !== null &&
    'id' in event &&
    typeof event.id === 'string'
  )
}

/**
 * Returns the error if it matches or throw it.
 */
export function checkStripeError<T extends Stripe.errors.StripeError['type']>(
  err: unknown,
  type: T
): NarrowedStripeError<T> {
  if (!isStripeErrorOfType(err, type)) {
    throw err
  }

  return err
}
