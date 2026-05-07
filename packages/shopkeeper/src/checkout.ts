import type Stripe from 'stripe'
import { type ManagesCustomerContract } from './contracts.js'
import { CheckoutBuilder } from './builders/checkout_builder.js'

export class Checkout {
  /**
   * The Stripe checkout session instance.
   */
  #session: Stripe.Checkout.Session

  constructor(session: Stripe.Checkout.Session) {
    this.#session = session
  }

  /**
   * Begin a new guest checkout session.
   */
  static guest(): CheckoutBuilder {
    return new CheckoutBuilder()
  }

  /**
   * Begin a new checkout session for a customer.
   */
  static customer(owner: ManagesCustomerContract): CheckoutBuilder {
    return new CheckoutBuilder(owner)
  }

  /**
   * Get the Checkout Session as a Stripe Checkout Session object.
   */
  asStripeSession(): Stripe.Checkout.Session {
    return this.#session
  }
}
