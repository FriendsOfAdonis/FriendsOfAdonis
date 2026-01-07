import type Stripe from 'stripe'

type Error<T extends Stripe.errors.StripeError['type']> = Stripe.errors.StripeError & { type: T }

/**
 * Returns the error if it matches or throw it.
 */
export function checkStripeError<T extends Stripe.errors.StripeError['type']>(
  err: any,
  type: T
): Error<T> {
  if (!('type' in err)) {
    throw err
  }

  if (err.type !== type) {
    throw err
  }

  return err
}
