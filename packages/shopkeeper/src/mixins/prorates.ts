import type Stripe from 'stripe'

type Constructor = new (...args: any[]) => {}

export function Prorates<Model extends Constructor>(superclass: Model) {
  return class ProratesImpl extends superclass {
    /**
     * Indicates if the price change should be prorated.
     */
    #prorationBehaviour: Stripe.SubscriptionCreateParams.ProrationBehavior = 'create_prorations'

    /**
     * Indicate that the price change should not be prorated.
     */
    noProrate(): this {
      this.#prorationBehaviour = 'none'
      return this
    }

    /**
     * Indicate that the price change should be prorated.
     */
    prorate(): this {
      this.#prorationBehaviour = 'create_prorations'
      return this
    }

    /**
     * Indicate that the price change should always be invoiced.
     */
    alwaysInvoice(): this {
      this.#prorationBehaviour = 'always_invoice'
      return this
    }

    /**
     * Set the prorating behavior.
     */
    setProrationBehavior(
      prorationBehaviour: Stripe.SubscriptionCreateParams.ProrationBehavior
    ): this {
      this.#prorationBehaviour = prorationBehaviour
      return this
    }

    /**
     * Determine the prorating behavior when updating the subscription.
     */
    prorateBehavior(): Stripe.SubscriptionCreateParams.ProrationBehavior {
      return this.#prorationBehaviour
    }
  }
}

export type WithProrates = ReturnType<typeof Prorates>['prototype']
