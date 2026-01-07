import type Stripe from 'stripe'

type Constructor = new (...args: any[]) => {}

export function InteractWithPaymentBehavior<Model extends Constructor>(superclass: Model) {
  return class InteractWithPaymentBehaviorImpl extends superclass {
    /**
     * Set the payment behavior for any subscription updates.
     */
    #paymentBehavior: Stripe.SubscriptionCreateParams.PaymentBehavior = 'default_incomplete'

    /**
     * Allow subscription changes even if payment fails.
     */
    defaultIncomplete(): this {
      this.#paymentBehavior = 'default_incomplete'
      return this
    }

    /**
     * Allow subscription changes even if payment fails.
     */
    allowPaymentFailures(): this {
      this.#paymentBehavior = 'allow_incomplete'
      return this
    }

    /**
     * Set any subscription change as pending until payment is successful.
     */
    pendingIfPaymentFails(): this {
      this.#paymentBehavior = 'pending_if_incomplete'
      return this
    }

    /**
     * Prevent any subscription change if payment is unsuccessful.
     */
    errorIfPaymentFails(): this {
      this.#paymentBehavior = 'error_if_incomplete'
      return this
    }

    /**
     * Determine the payment behavior when updating the subscription.
     */
    paymentBehavior() {
      return this.#paymentBehavior
    }

    /**
     * Set the payment behavior for any subscription updates.
     */
    setPaymentBehavior(paymentBehavior: Stripe.SubscriptionCreateParams.PaymentBehavior): this {
      this.#paymentBehavior = paymentBehavior
      return this
    }
  }
}

export type WithInteractWithPaymentBehavior = ReturnType<
  typeof InteractWithPaymentBehavior
>['prototype']
