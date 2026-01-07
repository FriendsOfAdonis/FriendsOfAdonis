import type Stripe from 'stripe'
import { type WithBillable } from './mixins/billable.js'
import { type SubscriptionBuilder } from './subscription_builder.js'
import { CheckoutBuilder } from './checkout_builder.js'
import shopkeeper from '../services/shopkeeper.js'
import router from '@adonisjs/core/services/router'

export class Checkout {
  /**
   * The Stripe model instance.
   */
  // @ts-ignore -- Not used yet
  #owner: WithBillable['prototype'] | null

  /**
   * The Stripe checkout session instance.
   */
  #session: Stripe.Checkout.Session

  constructor(owner: WithBillable['prototype'] | null, session: Stripe.Checkout.Session) {
    this.#owner = owner
    this.#session = session
  }

  /**
   * Get the Checkout Session as a Stripe Checkout Session object.
   */
  asStripeSession(): Stripe.Checkout.Session {
    return this.#session
  }

  /**
   * Begin a new guest checkout session.
   */
  static guest(): CheckoutBuilder {
    return new CheckoutBuilder()
  }

  static customer(owner: WithBillable['prototype'], parentInstance: SubscriptionBuilder) {
    return new CheckoutBuilder(owner, parentInstance)
  }

  /**
   * Begin a new checkout session.
   */
  static async create(
    owner?: WithBillable['prototype'],
    sessionParams: Stripe.Checkout.SessionCreateParams = {},
    customerParams: Stripe.CustomerCreateParams = {}
  ): Promise<Checkout> {
    const stripe = owner?.stripe ?? shopkeeper.stripe
    const data: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      ...sessionParams,
    }

    if (owner) {
      const customer = await owner.createOrGetStripeCustomer(customerParams)
      data.customer = customer.id
    }

    if (data.customer && data.tax_id_collection?.enabled) {
      data.customer_update = {
        ...data.customer_update,
        address: 'auto',
        name: 'auto',
      }
    }

    if (data.mode === 'payment' && data.invoice_creation?.enabled) {
      data.invoice_creation = {
        ...data.invoice_creation,
        invoice_data: {
          ...data.invoice_creation.invoice_data,
          metadata: {
            ...data.invoice_creation.invoice_data?.metadata,
            is_on_session_checkout: 'true',
          },
        },
      }
    } else if (data.mode === 'subscription') {
      data.subscription_data = {
        ...data.subscription_data,
        metadata: {
          ...data.subscription_data?.metadata,
          is_on_session_checkout: 'true',
        },
      }
    }

    if (data.ui_mode === 'embedded') {
      if (data.redirect_on_completion === 'never') {
        data.return_url = undefined
      } else {
        data.return_url = data.return_url ?? router.makeUrl('home')
      }
    } else {
      data.success_url = data.success_url ?? router.makeUrl('home', { checkout: 'success' })
      data.cancel_url = data.cancel_url ?? router.makeUrl('home', { checkout: 'cancelled' })
    }

    const session = await stripe.checkout.sessions.create(data)

    return new this(owner ?? null, session)
  }
}
