import { DateTime } from 'luxon'
import type Stripe from 'stripe'
import { Exception } from '@adonisjs/core/exceptions'
import { Checkout } from './checkout.js'
import type Subscription from './models/subscription.js'
import { compose } from '@adonisjs/core/helpers'
import { HandlesTaxes } from './mixins/handles_taxes.js'
import { Empty } from './types.js'
import { type WithManagesSubscriptions } from './mixins/manages_subscriptions.js'
import { AllowsCoupon } from './mixins/allows_coupons.js'
import { HandlesPaymentFailures } from './mixins/handles_payment_failures.js'
import { InteractWithPaymentBehavior } from './mixins/interacts_with_payment_behavior.js'
import { Prorates } from './mixins/prorates.js'

export class SubscriptionBuilder extends compose(
  Empty,
  AllowsCoupon,
  HandlesPaymentFailures,
  HandlesTaxes,
  InteractWithPaymentBehavior,
  Prorates
) {
  /**
   * The model that is subscribing.
   */
  #owner: WithManagesSubscriptions['prototype']

  /**
   * The type of the subscription.
   */
  #type?: string

  /**
   * The prices the customer is being subscribed to.
   */
  #items: Stripe.SubscriptionCreateParams.Item[] = []

  /**
   * The date and time the trial will expire.
   */
  #trialExpires?: DateTime

  /**
   * Indicates that the trial should end immediately.
   */
  #skipTrial = false

  /**
   * The date on which the billing cycle should be anchored.
   */
  #billingCycleAnchor?: number

  /**
   * The metadata to apply to the subscription.
   */
  #metadata: Record<string, string> = {}

  constructor(owner: WithManagesSubscriptions['prototype'], type: string, prices: string[]) {
    super()
    this.#owner = owner
    this.#type = type

    for (const price of prices) {
      this.price(price)
    }
  }

  /**
   * Set a price on the subscription builder.
   */
  price(
    price: string | Partial<Stripe.SubscriptionCreateParams.Item>,
    quantity: number | null = 1
  ): this {
    let options: Stripe.SubscriptionCreateParams.Item
    if (typeof price === 'string') {
      options = {
        price,
        quantity: quantity === null ? undefined : quantity,
        tax_rates: this.getPriceTaxRatesForPayload(price),
      }
    } else {
      options = {
        ...price,
        quantity: quantity === null ? undefined : quantity,
      }
    }

    if (options.price) {
      const i = this.#items.findIndex((item) => item.price === options.price)
      i >= 0 ? (this.#items[i] = options) : this.#items.push(options)
    } else {
      this.#items.push(options)
    }

    return this
  }

  /**
   * Set a metered price on the subscription builder.
   */
  meteredPrice(price: string): this {
    return this.price(price, null)
  }

  /**
   * Specify the quantity of a subscription item.
   */
  quantity(quantity: number, price?: string): this {
    let p: string
    if (price) {
      p = price
    } else {
      const itemsWithPrice = this.#items.filter((item) => item.price)
      if (itemsWithPrice.length > 1) {
        throw new Exception('Price is required when creating subscriptions with multiple prices.')
      }

      p = itemsWithPrice[0].price!
    }

    return this.price(p, quantity)
  }

  /**
   * Specify the number of days of the trial.
   */
  trialDays(days: number): this {
    this.#trialExpires = DateTime.now().plus({ days })
    return this
  }

  /**
   * Specify the ending date of the trial.
   */
  trialUntil(date: DateTime): this {
    this.#trialExpires = date
    return this
  }

  /**
   * Force the trial to end immediately.
   */
  skipTrial(): this {
    this.#skipTrial = true
    return this
  }

  /**
   * Change the billing cycle anchor on a subscription creation.
   */
  anchorBillingCycleOn(date: DateTime | number): this {
    this.#billingCycleAnchor = date instanceof DateTime ? date.toUnixInteger() : date
    return this
  }

  /**
   * The metadata to apply to a new subscription.
   */
  withMetadata(metadata: Record<string, string>): this {
    this.#metadata = metadata
    return this
  }

  /**
   * Add a new Stripe subscription to the Stripe model.
   */
  async add(
    customerParams: Stripe.CustomerCreateParams = {},
    subscriptionParams: Partial<Stripe.SubscriptionCreateParams> = {}
  ): Promise<Subscription> {
    return this.create(undefined, customerParams, subscriptionParams)
  }

  /**
   * Create a new Stripe subscription.
   */
  async create(
    paymentMethod?: string | Stripe.PaymentMethod,
    customerParams: Stripe.CustomerCreateParams = {},
    subscriptionParams: Partial<Stripe.SubscriptionCreateParams> = {}
  ): Promise<Subscription> {
    if (this.#items.length <= 0) {
      throw new Exception('At least one price is required when starting subscriptions.')
    }

    const stripeCustomer = await this.getStripeCustomer(paymentMethod, customerParams)

    const stripeSuscription = await this.#owner.stripe.subscriptions.create({
      customer: stripeCustomer.id,
      ...this.buildPayload(),
      ...subscriptionParams,
    })

    const subscription = await this.createSubscription(stripeSuscription)

    await this.handlePaymentFailure(subscription, paymentMethod)

    return subscription
  }

  /**
   * Create a new Stripe subscription and send an invoice to the customer.
   */
  async createAndSendInvoice(
    customerParams: Stripe.CustomerCreateParams = {},
    subscriptionParams: Omit<Stripe.SubscriptionCreateParams, 'collection_method' | 'customer'> = {}
  ): Promise<Subscription> {
    return this.create(undefined, customerParams, {
      days_until_due: 30,
      collection_method: 'send_invoice',
      ...subscriptionParams,
    })
  }

  /**
   * Create the Subscription.
   */
  async createSubscription(stripeSubscription: Stripe.Subscription): Promise<Subscription> {
    let subscription = await this.#owner
      .related('subscriptions')
      .query()
      .where('stripeId', stripeSubscription.id)
      .first()

    if (subscription) {
      return subscription
    }

    const firstItem = stripeSubscription.items.data[0]
    const isSinglePrice = stripeSubscription.items.data.length === 1

    subscription = await this.#owner.related('subscriptions').create({
      type: this.#type,
      stripeId: stripeSubscription.id,
      stripeStatus: stripeSubscription.status,
      stripePrice: isSinglePrice ? firstItem.price.id : null,
      quantity: isSinglePrice ? firstItem.quantity : undefined,
      trialEndsAt: this.#skipTrial ? undefined : this.#trialExpires,
      endsAt: null,
    })

    for (const item of stripeSubscription.items.data) {
      await subscription.related('items').create({
        stripeId: item.id,
        stripeProduct: item.price.product as string,
        stripePrice: item.price.id,
        quantity: item.quantity,
      })
    }

    return subscription
  }

  /**
   * Begin a new Checkout Session.
   */
  async checkout(
    sessionParams: Stripe.Checkout.SessionCreateParams = {},
    customerParams: Stripe.CustomerCreateParams = {}
  ): Promise<Checkout> {
    if (this.#items.length <= 0) {
      throw new Exception('At least one price is required when starting subscriptions.')
    }

    let trialEnd: DateTime | null = null
    if (this.#skipTrial && this.#trialExpires) {
      const minimumTrialPeriod = DateTime.now().plus({ hours: 48, seconds: 10 })
      trialEnd = this.#trialExpires > minimumTrialPeriod ? this.#trialExpires : minimumTrialPeriod
    }

    const billingCycleAnchor = trialEnd ? this.#billingCycleAnchor : null

    return Checkout.customer(this.#owner as any, this).create(
      [],
      {
        // TODO: Avoid as any
        line_items: this.#items as any,
        mode: 'subscription',
        subscription_data: {
          default_tax_rates: this.getTaxRatesForPayload() ?? undefined,
          trial_end: trialEnd?.toUnixInteger(),
          billing_cycle_anchor: billingCycleAnchor ?? undefined,
          proration_behavior: billingCycleAnchor ? (this.prorateBehavior() as any) : undefined, // TODO: Avoid as
          metadata: {
            ...this.#metadata,
            ...(this.#type && {
              name: this.#type,
              type: this.#type,
            }),
          },
        },
        ...sessionParams,
      },
      customerParams
    )
  }

  /**
   * Get the Stripe customer instance for the current user and payment method.
   */
  async getStripeCustomer(
    paymentMethod?: string | Stripe.PaymentMethod,
    params: Stripe.CustomerCreateParams = {}
  ): Promise<Stripe.Customer> {
    const customer = await this.#owner.createOrGetStripeCustomer(params)

    if (paymentMethod) {
      await this.#owner.updateDefaultPaymentMethod(paymentMethod)
    }

    return customer
  }

  // TODO:
  /**
   * Build the payload for subscription creation.
   */
  buildPayload(): Partial<Stripe.SubscriptionCreateParams> {
    return {
      automatic_tax: this.automaticTaxPayload(),
      billing_cycle_anchor: this.#billingCycleAnchor,
      coupon: this.couponId,
      expand: ['latest_invoice.payment_intent'],
      metadata: this.#metadata,
      items: this.#items,
      payment_behavior: this.paymentBehavior(),
      promotion_code: this.promotionCodeId,
      proration_behavior: this.prorateBehavior(),
      trial_end: this.getTrialEndForPayload(),
      off_session: true,
    }
  }

  /**
   * Get the trial ending date for the Stripe payload.
   */
  getTrialEndForPayload(): 'now' | number | undefined {
    if (this.#skipTrial) {
      return 'now'
    }

    if (this.#trialExpires) {
      return this.#trialExpires.toUnixInteger()
    }
  }

  /**
   * Get the price tax rates for the Stripe payload.
   */
  // TODO: Type
  getTaxRatesForPayload(): string[] | null {
    return this.#owner.taxRates() ?? null
  }

  /**
   * Get the price tax rates for the Stripe payload.
   */
  getPriceTaxRatesForPayload(price: string): string[] | undefined {
    return this.#owner.priceTaxRates()[price] ?? undefined
  }

  /**
   * Get the items set on the subscription builder.
   */
  getItems() {
    return this.#items
  }
}
