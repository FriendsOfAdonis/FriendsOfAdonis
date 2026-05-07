import { compose } from '@adonisjs/core/helpers'
import { Empty } from '../types.js'
import { allowsCoupon } from '../mixins/allows_coupons.js'
import { handlesTaxes } from '../mixins/handles_taxes.js'
import { type ManagesCustomerContract } from '../contracts.js'
import type Stripe from 'stripe'
import { Checkout } from '../checkout.js'
import { Shopkeeper } from '../shopkeeper.js'
import { InvalidArgumentError } from '../errors/invalid_argument.js'

export class CheckoutBuilder
  extends compose(Empty, allowsCoupon(), handlesTaxes())
  implements PromiseLike<Checkout>
{
  #owner?: ManagesCustomerContract
  #lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  #sessionParams: Stripe.Checkout.SessionCreateParams = {}
  #customerParams: Stripe.CustomerCreateParams = {}

  constructor(owner?: ManagesCustomerContract) {
    super()
    this.#owner = owner
  }

  /**
   * Add a line item to the checkout session.
   */
  addLineItem(
    price: string,
    quantity = 1,
    params: Partial<Stripe.Checkout.SessionCreateParams.LineItem> = {}
  ): this {
    this.#lineItems.push({ price, quantity, ...params })
    return this
  }

  /**
   * Add a raw line item (e.g. with price_data) to the checkout session.
   */
  addRawLineItem(item: Stripe.Checkout.SessionCreateParams.LineItem): this {
    this.#lineItems.push(item)
    return this
  }

  /**
   * Set session parameters.
   */
  sessionParams(params: Stripe.Checkout.SessionCreateParams): this {
    this.#sessionParams = { ...this.#sessionParams, ...params }
    return this
  }

  /**
   * Set customer parameters.
   */
  customerParams(params: Stripe.CustomerCreateParams): this {
    this.#customerParams = { ...this.#customerParams, ...params }
    return this
  }

  /**
   * Create a new checkout session.
   */
  async create(): Promise<Checkout> {
    const stripe = Shopkeeper.$instance.stripe
    const discounts = this.checkoutDiscounts()

    const data: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      allow_promotion_codes: discounts ? undefined : this.allowPromotionCodes,
      automatic_tax: this.automaticTaxPayload(),
      discounts,
      line_items: this.#lineItems,
      tax_id_collection:
        (Shopkeeper.$instance.config.calculateTaxes ?? this.collectTaxIds)
          ? { enabled: true }
          : undefined,
      ...this.#sessionParams,
    }

    if (this.#owner) {
      const customer = await this.#owner.createOrGetStripeCustomer(this.#customerParams)
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
      if (data.redirect_on_completion !== 'never' && !data.return_url) {
        throw new InvalidArgumentError(
          'A return_url is required for embedded checkout sessions. Use .sessionParams({ return_url }) to set one.'
        )
      }
    } else {
      if (!data.success_url) {
        throw new InvalidArgumentError(
          'A success_url is required for checkout sessions. Use .sessionParams({ success_url }) to set one.'
        )
      }
      if (!data.cancel_url) {
        throw new InvalidArgumentError(
          'A cancel_url is required for checkout sessions. Use .sessionParams({ cancel_url }) to set one.'
        )
      }
    }

    const session = await stripe.checkout.sessions.create(data)
    return new Checkout(session)
  }

  then<TResult1 = Checkout, TResult2 = never>(
    onfulfilled?: ((value: Checkout) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.create().then(onfulfilled, onrejected)
  }
}
