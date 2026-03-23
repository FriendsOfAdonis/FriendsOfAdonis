import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Subscription from './subscription.js'
import { compose } from '@adonisjs/core/helpers'
import { handlesPaymentFailures } from '../mixins/handles_payment_failures.js'
import { interactWithPaymentBehavior } from '../mixins/interacts_with_payment_behavior.js'
import { prorates } from '../mixins/prorates.js'
import Stripe from 'stripe'
import { managesStripe } from '../mixins/manages_stripe.js'
import { DateTime } from 'luxon'
import { Shopkeeper } from '../shopkeeper.js'
import shopkeeper from '../../services/shopkeeper.js'

export default class SubscriptionItem extends compose(
  BaseModel,
  managesStripe(false),
  handlesPaymentFailures(),
  interactWithPaymentBehavior(),
  prorates()
) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare subscriptionId: number

  @belongsTo(() => shopkeeper.subscriptionModel)
  declare subscription: BelongsTo<typeof Subscription>

  @column()
  declare stripeProduct: string

  @column()
  declare stripePrice: string

  @column()
  declare quantity: number | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Increment the quantity of the subscription item.
   */
  incrementQuantity(count = 1): Promise<this> {
    return this.updateQuantity((this.quantity ?? 0) + count)
  }

  /**
   *  Increment the quantity of the subscription item, and invoice immediately.
   */
  incrementAndInvoice(count = 1): Promise<this> {
    this.alwaysInvoice()
    return this.incrementQuantity(count)
  }

  /**
   * Decrement the quantity of the subscription item.
   */
  decrementQuantity(count = 1): Promise<this> {
    if ((this.quantity ?? 0) - count < 0) {
      throw new Error('Quantity cannot be negative')
    }
    return this.updateQuantity((this.quantity ?? 0) - count)
  }

  /**
   *  Decrement the quantity of the subscription item, and invoice immediately.
   */
  decrementAndInvoice(count = 1): Promise<this> {
    this.alwaysInvoice()
    return this.decrementQuantity(count)
  }

  /**
   * Update the quantity of the subscription item.
   */
  async updateQuantity(quantity: number): Promise<this> {
    this.subscription.guardAgainstIncomplete()

    const stripeSubscriptionItem = await this.updateStripeSubscriptionItem({
      payment_behavior: this.paymentBehavior(),
      proration_behavior: this.prorateBehavior(),
      quantity,
    })

    this.quantity = stripeSubscriptionItem.quantity ?? null

    const stripeSubscription = await this.subscription.asStripeSubscription()

    if (this.subscription.hasStripeId()) {
      this.subscription.quantity = stripeSubscriptionItem.quantity ?? null
    }

    this.subscription.stripeStatus = stripeSubscription.status

    await this.handlePaymentFailure(this.subscription)

    return this
  }

  /**
   * Swap the subscription item to a new Stripe price.
   */
  async swap(price: string, params: Stripe.SubscriptionItemUpdateParams = {}): Promise<this> {
    this.subscription.guardAgainstIncomplete()

    const stripeSubscriptionItem = await this.updateStripeSubscriptionItem({
      price,
      quantity: this.quantity ?? undefined,
      payment_behavior: this.paymentBehavior(),
      proration_behavior: this.prorateBehavior(),
      tax_rates: await this.subscription.getPriceTaxRatesForPayload(price),
      ...params,
    })

    this.stripeProduct =
      typeof stripeSubscriptionItem.price.product === 'string'
        ? stripeSubscriptionItem.price.product
        : stripeSubscriptionItem.price.product.id
    this.stripePrice = stripeSubscriptionItem.price.id
    this.quantity = stripeSubscriptionItem.quantity ?? null

    await this.save()

    const stripeSubscription = await this.subscription.asStripeSubscription()

    if (this.subscription.hasSinglePrice()) {
      this.subscription.stripePrice = price
      this.subscription.quantity = stripeSubscriptionItem.quantity ?? null
    }

    this.subscription.stripeStatus = stripeSubscription.status

    await this.subscription.save()

    await this.handlePaymentFailure(this.subscription)

    return this
  }

  /**
   * Swap the subscription item to a new Stripe price, and invoice immediately.
   */
  swapAndInvoice(price: string, params: Stripe.SubscriptionItemUpdateParams = {}): Promise<this> {
    this.alwaysInvoice()
    return this.swap(price, params)
  }

  /**
   * Report a meter event for a metered product.
   */
  async reportUsage(
    this: SubscriptionItem,
    eventName: string,
    value = '1',
    params: Partial<Stripe.Billing.MeterEventCreateParams> = {}
  ): Promise<Stripe.Billing.MeterEvent> {
    await this.load('subscription')
    await this.subscription.load('user')

    const customerId = this.subscription.user.stripeIdOrFail()

    const stripe = await Shopkeeper.resolveStripe()
    return stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: customerId,
        value,
      },
      ...params,
    })
  }

  /**
   * Get the meter event summaries for a metered product.
   */
  async usageRecords(
    this: SubscriptionItem,
    meterId: string,
    params: Omit<Stripe.Billing.MeterListEventSummariesParams, 'customer'>
  ): Promise<Stripe.Billing.MeterEventSummary[]> {
    await this.load('subscription')
    await this.subscription.load('user')

    const customerId = this.subscription.user.stripeIdOrFail()

    const stripe = await Shopkeeper.resolveStripe()
    const response = await stripe.billing.meters.listEventSummaries(meterId, {
      customer: customerId,
      ...params,
    })
    return response.data
  }

  /**
   * Update the underlying Stripe subscription item information for the model.
   */
  async updateStripeSubscriptionItem(
    params: Stripe.SubscriptionItemUpdateParams = {}
  ): Promise<Stripe.SubscriptionItem> {
    const stripe = await Shopkeeper.resolveStripe()
    return stripe.subscriptionItems.update(this.stripeId, params)
  }

  /**
   * Get the subscription as a Stripe subscription item object.
   */
  async asStripeSubscriptionItem(expand: string[] = []): Promise<Stripe.SubscriptionItem> {
    const stripe = await Shopkeeper.resolveStripe()
    return stripe.subscriptionItems.retrieve(this.stripeId, { expand })
  }
}
