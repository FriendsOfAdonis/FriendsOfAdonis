import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Stripe from 'stripe'
import { compose } from '@adonisjs/core/helpers'
import { ManagesStripe } from '../mixins/manages_stripe.js'
import { Exception } from '@adonisjs/core/exceptions'
import { WithBillable } from '../mixins/billable.js'
import { IncompletePaymentError } from '../errors/incomplete_payment.js'
import { Invoice } from '../invoice.js'
import { Payment } from '../payment.js'
import { Discount } from '../discount.js'
import { SubscriptionUpdateFailureError } from '../errors/subscription_update_failure.js'
import shopkeeper from '../../services/shopkeeper.js'
import { AllowsCoupon } from '../mixins/allows_coupons.js'
import { HandlesPaymentFailures } from '../mixins/handles_payment_failures.js'
import { InteractWithPaymentBehavior } from '../mixins/interacts_with_payment_behavior.js'
import { Prorates } from '../mixins/prorates.js'
import is from '@adonisjs/core/helpers/is'
import SubscriptionItem from './subscription_item.js'
import { InvalidArgumentError } from '../errors/invalid_argument.js'

type SwapPricesParam =
  | string
  | string[]
  | Stripe.SubscriptionUpdateParams.Item[]
  | Record<string, Stripe.SubscriptionUpdateParams.Item>

export default class Subscription extends compose(
  BaseModel,
  ManagesStripe(false),
  AllowsCoupon,
  HandlesPaymentFailures,
  InteractWithPaymentBehavior,
  Prorates
) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  // TODO: Decorate and type
  @belongsTo(() => shopkeeper.customerModel)
  declare user: BelongsTo<WithBillable>

  @column()
  declare type: string

  @column()
  declare stripeStatus: Stripe.Subscription.Status

  @column()
  declare stripePrice: string | null

  @column()
  declare quantity: number | null

  @hasMany(() => shopkeeper.subscriptionItemModel)
  declare items: HasMany<typeof SubscriptionItem>

  @column.dateTime()
  declare trialEndsAt: DateTime | null

  @column.dateTime()
  declare endsAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  billingCycleAnchor?: Stripe.SubscriptionUpdateParams.BillingCycleAnchor

  /**
   * Determine if the subscription has a single price.
   */
  hasMultiplePrices(): boolean {
    return !this.stripePrice
  }

  /**
   * Determine if the subscription has a single price.
   */
  hasSinglePrice(): boolean {
    return !this.hasMultiplePrices()
  }

  /**
   * Determine if the subscription has a specific product.
   */
  async hasProduct(product: string): Promise<boolean> {
    // @ts-ignore -- Lucid type issue
    await this.load('items')
    return this.items.some((i) => i.stripeProduct === product)
  }

  /**
   * Determine if the subscription has a specific price.
   */
  async hasPrice(price: string): Promise<boolean> {
    if (this.hasMultiplePrices()) {
      // @ts-ignore -- Lucid type issue
      await this.load('items')
      return this.items.some((i) => i.stripePrice === price)
    }

    return this.stripePrice === price
  }

  /**
   * Get the subscription item for the given price.
   */
  findItemOrFail(price: string): Promise<SubscriptionItem> {
    // @ts-ignore -- Lucid type issue
    return this.related('items').query().where('stripePrice', price).firstOrFail()
  }

  /**
   * Determine if the subscription is active, on trial, or within its grace period.
   */
  valid() {
    return this.active() || this.onTrial() || this.onGracePeriod()
  }

  /**
   * Determine if the subscription is incomplete.
   */
  incomplete() {
    return this.stripeStatus === 'incomplete'
  }

  // TODO: SCOPES

  /**
   * Determine if the subscription is past due.
   */
  pastDue() {
    return this.stripeStatus === 'past_due'
  }

  /**
   * Determine if the subscription is active.
   */
  active(): boolean {
    return (
      !this.ended() &&
      (!shopkeeper.config.keepIncompleteSubscriptionsActive ||
        this.stripeStatus !== 'incomplete') &&
      (!shopkeeper.config.keepPastDueSubscriptionsActive || this.stripeStatus !== 'past_due') &&
      this.stripeStatus !== 'unpaid'
    )
  }

  /**
   * Sync the Stripe status of the subscription.
   */
  async syncStripeStatus(): Promise<void> {
    const subscription = await this.asStripeSubscription()
    this.stripeStatus = subscription.status
    await this.save()
  }

  /**
   * Determine if the subscription is recurring and not on trial.
   */
  recurring(): boolean {
    return !this.onTrial() && !this.canceled()
  }

  /**
   * Determine if the subscription is no longer active.
   */
  canceled(): boolean {
    return !!this.endsAt
  }

  /**
   * Determine if the subscription has ended and the grace period has expired.
   */
  ended(): boolean {
    return this.canceled() && !this.onGracePeriod()
  }

  /**
   * Determine if the subscription is within its trial period.
   */
  onTrial(): boolean {
    return this.trialEndsAt ? this.trialEndsAt > DateTime.now() : false
  }

  /**
   * Determine if the subscription's trial has expired.
   */
  hasExpiredTrial(): boolean {
    return this.trialEndsAt ? this.trialEndsAt < DateTime.now() : false
  }

  /**
   * Determine if the subscription is within its grace period after cancellation.
   */
  onGracePeriod(): boolean {
    return this.endsAt ? this.endsAt > DateTime.now() : false
  }

  /**
   * Increment the quantity of the subscription.
   */
  async incrementQuantity(count = 1, price?: string): Promise<this> {
    this.guardAgainstIncomplete()

    if (price) {
      const item = await this.findItemOrFail(price)
      await item
        .setPaymentBehavior(this.paymentBehavior())
        .setProrationBehavior(this.prorateBehavior())
        .incrementQuantity(count)

      await this.refresh()
    }

    this.guardAgainstMultiplePrices()

    return this.updateQuantity(this.quantity! + count, price)
  }

  /**
   *  Increment the quantity of the subscription, and invoice immediately.
   */
  async incrementAndInvoice(count = 1, price?: string): Promise<this> {
    this.guardAgainstIncomplete()
    this.alwaysInvoice()
    return this.incrementQuantity(count, price)
  }

  /**
   * Decrement the quantity of the subscription.
   */
  async decrementQuantity(count = 1, price?: string): Promise<this> {
    this.guardAgainstIncomplete()

    if (price) {
      const item = await this.findItemOrFail(price)
      await item
        .setPaymentBehavior(this.paymentBehavior())
        .setProrationBehavior(this.prorateBehavior())
        .decrementQuantity(count)

      await this.refresh()
    }

    this.guardAgainstMultiplePrices()

    return this.updateQuantity(this.quantity! - count, price)
  }

  /**
   * Update the quantity of the subscription.
   */
  async updateQuantity(quantity: number, price?: string): Promise<this> {
    this.guardAgainstIncomplete()

    if (price) {
      const item = await this.findItemOrFail(price)
      await item
        .setPaymentBehavior(this.paymentBehavior())
        .setProrationBehavior(this.prorateBehavior())
        .updateQuantity(quantity)
    }

    this.guardAgainstMultiplePrices()

    // TODO: quickfix as stripe does not have quantity on subscription
    // a lot of calls are made here
    let stripeSubscription = await this.asStripeSubscription()

    const si = stripeSubscription.items.data[0].id

    stripeSubscription = await this.updateStripeSubscription({
      payment_behavior: this.paymentBehavior(),
      proration_behavior: this.prorateBehavior(),
      expand: ['latest_invoice.payment_intent'],
      items: [
        {
          id: si,
          quantity,
        },
      ],
    })

    this.quantity = quantity
    this.stripeStatus = stripeSubscription.status

    await this.save()

    await this.handlePaymentFailure(this)

    return this
  }

  /**
   * Report usage for a metered product.
   */
  async reportUsage(quantity = 1, timestamp?: number, price?: string): Promise<Stripe.UsageRecord> {
    if (!price) {
      this.guardAgainstMultiplePrices()
    }

    const item = await this.findItemOrFail(price ?? this.stripePrice!)
    return item.reportUsage(quantity, timestamp)
  }

  /**
   * Report usage for specific price of a metered product.
   */
  reportUsageFor(price: string, quantity = 1, timestamp?: number): Promise<Stripe.UsageRecord> {
    return this.reportUsage(quantity, timestamp, price)
  }

  /**
   * Get the usage records for a metered product.
   */
  async usageRecords(
    params: Stripe.SubscriptionItemListUsageRecordSummariesParams = {},
    price?: string
  ): Promise<Stripe.UsageRecordSummary[]> {
    if (!price) {
      this.guardAgainstMultiplePrices()
    }

    const item = await this.findItemOrFail(price ?? this.stripePrice!)
    return item.usageRecords(params)
  }

  /**
   * Get the usage records for a specific price of a metered product.
   */
  usageRecordsFor(
    price: string,
    params: Stripe.SubscriptionItemListUsageRecordSummariesParams = {}
  ): Promise<Stripe.UsageRecordSummary[]> {
    return this.usageRecords(params, price)
  }

  /**
   * Change the billing cycle anchor on a price change.
   * TODO: The does not seem to be possible
   */
  anchorBillingCycleOn(
    date: Stripe.SubscriptionUpdateParams.BillingCycleAnchor = 'unchanged'
  ): this {
    this.billingCycleAnchor = date
    return this
  }

  /**
   * Force the trial to end immediately.
   *
   * This method must be combined with swap, resume, etc.
   */
  skipTrial(): this {
    this.trialEndsAt = null
    return this
  }

  /**
   * Force the subscription's trial to end immediately.
   */
  async endTrial(): Promise<this> {
    if (!this.trialEndsAt) {
      return this
    }

    await this.updateStripeSubscription({
      trial_end: 'now',
      proration_behavior: this.prorateBehavior(),
    })

    this.trialEndsAt = null
    await this.save()
    return this
  }

  /**
   * Extend an existing subscription's trial period.
   */
  async extendTrial(date: DateTime): Promise<this> {
    if (date < DateTime.now()) {
      throw new Exception("Extending a subscription's trial requires a date in the future.")
    }

    await this.updateStripeSubscription({
      trial_end: date.toUnixInteger(),
      proration_behavior: this.prorateBehavior(),
    })

    this.trialEndsAt = date
    await this.save()
    return this
  }

  /**
   * Swap the subscription to new Stripe prices.
   */
  async swap(prices: SwapPricesParam, params: Stripe.SubscriptionUpdateParams = {}): Promise<this> {
    if (is.array(prices) && prices.length <= 0) {
      throw new Exception('Please provide at least one price when swapping.')
    }

    this.guardAgainstIncomplete()

    const items = await this.mergeItemsThatShouldBeDeletedDuringSwap(
      await this.parseSwapPrices(prices)
    )

    const stripeSubscription = await this.stripe.subscriptions.update(
      this.stripeId,
      this.getSwapOptions(items, params)
    )

    const firstItem = stripeSubscription.items.data[0]
    const isSinglePrice = stripeSubscription.items.data.length === 1

    this.stripeStatus = stripeSubscription.status
    this.stripePrice = isSinglePrice ? firstItem.price.id : null
    this.quantity = isSinglePrice ? (firstItem.quantity ?? null) : null
    this.endsAt = null

    await this.save()

    const subscriptionItemIds = []

    // Could be done in batch
    for (const item of stripeSubscription.items.data) {
      subscriptionItemIds.push(item.id)

      await SubscriptionItem.updateOrCreate(
        {
          subscriptionId: this.id,
          stripeId: item.id,
        },
        {
          stripeProduct: item.price.product as string,
          stripePrice: item.price.id,
          quantity: item.quantity ?? null,
        }
      )
    }

    // Delete items that aren't attached to the subscription anymore
    // @ts-ignore -- Lucid type issue
    await this.related('items').query().delete().whereNotIn('stripeId', subscriptionItemIds)

    await this.handlePaymentFailure(this)

    return this
  }

  /**
   * Swap the subscription to new Stripe prices, and invoice immediately.
   */
  async swapAndInvoice(
    prices: string | string[],
    params: Stripe.SubscriptionUpdateParams = {}
  ): Promise<this> {
    this.alwaysInvoice()
    return this.swap(prices, params)
  }

  /**
   * Parse the given prices for a swap operation.
   */
  protected async parseSwapPrices(
    prices: SwapPricesParam
  ): Promise<Map<string, Stripe.SubscriptionUpdateParams.Item>> {
    const isSinglePriceSwap = this.hasSinglePrice() && prices.length === 1

    const output = new Map<string, Stripe.SubscriptionUpdateParams.Item>()

    const entries = typeof prices === 'string' ? [[prices, prices]] : Object.entries(prices)

    for (const [key, value] of entries as [
      key: string,
      value: string | Stripe.SubscriptionUpdateParams.Item,
    ][]) {
      const price = typeof value === 'string' ? value : key
      const options = typeof value === 'string' ? {} : value

      const payload: Stripe.SubscriptionUpdateParams.Item = {
        tax_rates: await this.getPriceTaxRatesForPayload(price),
      }

      if (!options.price_data) {
        payload.price = price
      }

      if (isSinglePriceSwap && !!this.quantity) {
        payload.quantity = this.quantity
      }

      output.set(price, { ...payload, ...options })
    }

    return output
  }

  /**
   * Merge the items that should be deleted during swap into the given items collection.
   *
   * TODO: Test this properly as im not sure of what i did
   */
  protected async mergeItemsThatShouldBeDeletedDuringSwap(
    items: Map<string, Stripe.SubscriptionUpdateParams.Item>
  ): Promise<Map<string, Stripe.SubscriptionUpdateParams.Item>> {
    const stripeSubscription = await this.asStripeSubscription()

    for (const stripeSubscriptionItem of stripeSubscription.items.data) {
      const price = stripeSubscriptionItem.price
      const item = items.get(price.id) || {}
      if (!items.has(price.id)) {
        item.deleted = true
        if (price.recurring?.usage_type === 'metered') {
          item.clear_usage = true
        }
      }

      items.set(price.id, { ...item, id: stripeSubscriptionItem.id })
    }

    return items
  }

  /**
   * Get the options array for a swap operation.
   */
  protected getSwapOptions(
    items: Map<string, Stripe.SubscriptionUpdateParams.Item>,
    params: Stripe.SubscriptionUpdateParams = {}
  ): Stripe.SubscriptionUpdateParams {
    let payload: Stripe.SubscriptionUpdateParams = {
      items: [...items.values()],
      payment_behavior: this.paymentBehavior(),
      proration_behavior: this.prorateBehavior(),
      promotion_code: this.promotionCodeId,
      expand: ['latest_invoice.payment_intent'],
    }

    if (payload.payment_behavior !== 'pending_if_incomplete') {
      payload.cancel_at_period_end = false
    }

    payload = {
      ...payload,
      ...params,
      billing_cycle_anchor: this.billingCycleAnchor,
      trial_end: this.onTrial() ? this.trialEndsAt!.toUnixInteger() : 'now',
    }

    return payload
  }

  /**
   * Add a new Stripe price to the subscription.
   */
  async addPrice(
    price: string,
    quantity: number | null = 1,
    params: Partial<Stripe.SubscriptionItemCreateParams> = {}
  ): Promise<this> {
    this.guardAgainstIncomplete()

    // @ts-ignore -- Lucid type issue
    await this.load('items')
    if (this.items.some((i) => i.stripePrice === price)) {
      throw SubscriptionUpdateFailureError.duplicatePrice(this, price)
    }

    const stripeSubscriptionItem = await this.stripe.subscriptionItems.create({
      subscription: this.stripeId,
      price,
      quantity: quantity ?? undefined,
      tax_rates: await this.getPriceTaxRatesForPayload(price),
      payment_behavior: this.paymentBehavior(),
      proration_behavior: this.prorateBehavior(),
      ...params,
    })

    // @ts-ignore -- Lucid type issue
    await this.related('items').create({
      stripeId: stripeSubscriptionItem.id,
      stripeProduct: stripeSubscriptionItem.price.product,
      stripePrice: stripeSubscriptionItem.price.id,
      quantity: stripeSubscriptionItem.quantity,
    })

    const stripeSubscription = await this.asStripeSubscription()

    if (this.hasSinglePrice()) {
      this.stripePrice = null
      this.quantity = null
    }

    this.stripeStatus = stripeSubscription.status

    await this.handlePaymentFailure(this)

    return this
  }

  /**
   * Add a new Stripe price to the subscription, and invoice immediately.
   */
  addPriceAndInvoice(
    price: string,
    quantity: number | null = 1,
    params: Partial<Stripe.SubscriptionItemCreateParams> = {}
  ): Promise<this> {
    this.alwaysInvoice()
    return this.addPrice(price, quantity, params)
  }

  /**
   * Add a new Stripe metered price to the subscription.
   */
  addMeteredPrice(
    price: string,
    params: Partial<Stripe.SubscriptionItemCreateParams> = {}
  ): Promise<this> {
    return this.addPrice(price, null, params)
  }

  /**
   * Add a new Stripe metered price to the subscription, and invoice immediately.
   */
  addMeteredPriceAndInvoice(
    price: string,
    params: Partial<Stripe.SubscriptionItemCreateParams> = {}
  ): Promise<this> {
    return this.addPriceAndInvoice(price, null, params)
  }

  /**
   * Remove a Stripe price from the subscription.
   */
  async removePrice(price: string): Promise<this> {
    if (this.hasSinglePrice()) {
      throw new Exception('Last price') // TODO: error
    }

    const item = await this.findItemOrFail(price)
    const stripeItem = await item.asStripeSubscriptionItem()

    await this.stripe.subscriptionItems.del(stripeItem.id, {
      clear_usage: stripeItem.price.recurring?.usage_type === 'metered' ? true : undefined,
      proration_behavior: this.prorateBehavior(),
    })

    await item.delete()

    if (this.items.length < 2) {
      const i = this.items[0]
      this.stripePrice = i.stripePrice
      this.quantity = i.quantity
      await this.save()
    }

    return this
  }

  /**
   * Cancel the subscription at the end of the billing period.
   */
  async cancel(): Promise<this> {
    const stripeSubscription = await this.updateStripeSubscription({
      cancel_at_period_end: true,
    })

    this.stripeStatus = stripeSubscription.status

    if (this.onTrial()) {
      this.endsAt = this.trialEndsAt
    } else {
      this.endsAt = DateTime.fromSeconds(stripeSubscription.current_period_end)
    }

    await this.save()
    return this
  }

  /**
   * Cancel the subscription at a specific moment in time.
   */
  async cancelAt(date: DateTime | number): Promise<this> {
    const endsAt = date instanceof DateTime ? date.toUnixInteger() : date
    const stripeSubscription = await this.updateStripeSubscription({
      cancel_at: endsAt,
      proration_behavior: this.prorateBehavior(),
    })

    this.stripeStatus = stripeSubscription.status
    this.endsAt = stripeSubscription.cancel_at
      ? DateTime.fromSeconds(stripeSubscription.cancel_at)
      : null

    await this.save()
    return this
  }

  /**
   * Cancel the subscription immediately without invoicing.
   */
  async cancelNow(): Promise<this> {
    await this.stripe.subscriptions.cancel(this.stripeId, {
      prorate: this.prorateBehavior() === 'create_prorations',
    })

    await this.markAsCanceled()
    return this
  }

  /**
   * Cancel the subscription immediately and invoice.
   */
  async cancelNowAndInvoice() {
    await this.stripe.subscriptions.cancel(this.stripeId, {
      invoice_now: true,
      prorate: this.prorateBehavior() === 'create_prorations',
    })

    await this.markAsCanceled()
    return this
  }

  /**
   * Mark the subscription as canceled.
   */
  async markAsCanceled(): Promise<void> {
    this.stripeStatus = 'canceled'
    this.endsAt = DateTime.now()
    await this.save()
  }

  /**
   * Resume the canceled subscription.
   */
  async resume(): Promise<this> {
    if (!this.onGracePeriod()) {
      throw new Exception('Unable to resume subscription that is not within grace period.')
    }

    const stripeSubscription = await this.updateStripeSubscription({
      cancel_at_period_end: false,
      trial_end: this.onTrial() ? this.trialEndsAt!.toUnixInteger() : 'now',
    })

    this.stripeStatus = stripeSubscription.status
    this.endsAt = null

    await this.save()
    return this
  }

  /**
   * Determine if the subscription has pending updates.
   */
  async pending(): Promise<boolean> {
    return this.asStripeSubscription().then((s) => !!s.pending_update)
  }

  /**
   * Invoice the subscription outside of the regular billing cycle.
   */
  async invoice(
    params: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams = {}
  ): Promise<Invoice> {
    // @ts-ignore -- Lucid type issue
    await this.load('user')
    try {
      const invoice = await this.user.invoice(params)
      return invoice
    } catch (e) {
      if (e instanceof IncompletePaymentError) {
        // @ts-ignore -- TODO: figure out
        this.stripeStatus = e.payment.invoice.subscription.status
        await this.save()
      }

      throw e
    }
  }

  /**
   * Get the latest invoice for the subscription.
   */
  async latestInvoice(expand: string[] = []): Promise<Invoice | null> {
    const stripeSubscription = await this.asStripeSubscription(['latest_invoice', ...expand])

    if (stripeSubscription.latest_invoice) {
      return new Invoice(this.user, stripeSubscription.latest_invoice as Stripe.Invoice)
    }

    return null
  }

  /**
   * Fetches upcoming invoice for this subscription.
   */
  async upcomingInvoice(
    params: Stripe.InvoiceRetrieveUpcomingParams = {}
  ): Promise<Invoice | null> {
    if (this.canceled()) {
      return null
    }

    return this.user.upcomingInvoice({
      ...params,
      subscription: this.stripeId,
    })
  }

  /**
   * Preview the upcoming invoice with new Stripe prices.
   */
  async previewInvoice(
    prices: string[] | string,
    params: Stripe.InvoiceRetrieveUpcomingParams = {}
  ): Promise<Invoice | null> {
    prices = typeof prices === 'string' ? [prices] : prices

    this.guardAgainstIncomplete()

    const swapItems = await this.mergeItemsThatShouldBeDeletedDuringSwap(
      await this.parseSwapPrices(prices)
    )

    const swapOptions = this.getSwapOptions(swapItems)

    const payload: Stripe.InvoiceRetrieveUpcomingParams = {
      subscription_billing_cycle_anchor: swapOptions.billing_cycle_anchor,
      subscription_cancel_at_period_end: swapOptions.cancel_at_period_end,
      subscription_items: swapOptions.items,
      subscription_proration_behavior: swapOptions.proration_behavior,
      subscription_trial_end: swapOptions.trial_end,
      ...params,
    }

    return this.upcomingInvoice(payload)
  }

  /**
   * Get a collection of the subscription's invoices.
   */
  async invoices(
    includePending = false,
    params: Stripe.InvoiceListParams = {}
  ): Promise<Invoice[]> {
    // @ts-ignore -- Lucid type issue
    await this.load('user')
    return this.user.invoices(includePending, {
      ...params,
      subscription: this.stripeId,
    })
  }

  /**
   * Get an array of the subscription's invoices, including pending invoices.
   */
  async invoicesIncludingPending(params: Stripe.InvoiceListParams = {}): Promise<Invoice[]> {
    return this.invoices(true, params)
  }

  /**
   * Sync the tax rates of the user to the subscription.
   */
  async syncTaxRates() {
    await this.updateStripeSubscription({
      default_tax_rates: this.user.taxRates() ?? null,
      proration_behavior: this.prorateBehavior(),
    })

    for (const item of this.items) {
      await item.updateStripeSubscriptionItem({
        tax_rates: (await this.getPriceTaxRatesForPayload(item.stripePrice)) ?? null,
        proration_behavior: this.prorateBehavior(),
      })
    }
  }

  /**
   * Get the price tax rates for the Stripe payload.
   */
  async getPriceTaxRatesForPayload(price: string): Promise<string[] | null> {
    // @ts-ignore -- Lucid type issue
    await this.load('user')
    return this.user.priceTaxRates()[price] ?? null
  }

  /**
   * Determine if the subscription has an incomplete payment.
   */
  hasIncompletePayment(): boolean {
    return this.pastDue() || this.incomplete()
  }

  /**
   * Get the latest payment for a Subscription.
   */
  async latestPayment(): Promise<Payment | null> {
    const subscription = await this.asStripeSubscription(['latest_invoice.payment_intent'])
    const pi = (subscription.latest_invoice as Stripe.Invoice)
      .payment_intent as Stripe.PaymentIntent
    return pi ? new Payment(pi) : null
  }

  /**
   * The discount that applies to the subscription, if applicable.
   */
  async discount(): Promise<Discount | null> {
    const subscription = await this.asStripeSubscription(['discount.promotion_code'])
    return subscription.discount ? new Discount(subscription.discount) : null
  }

  /**
   * Apply a coupon to the subscription.
   */
  async applyCoupon(coupon: string): Promise<void> {
    await this.updateStripeSubscription({
      coupon,
    })
  }

  /**
   * Apply a promotion code to the subscription.
   */
  async applyPromotionCode(promotionCode: string): Promise<void> {
    await this.updateStripeSubscription({
      promotion_code: promotionCode,
    })
  }

  /**
   * Make sure a subscription is not incomplete when performing changes.
   */
  guardAgainstIncomplete(): void {
    if (this.incomplete()) {
      throw SubscriptionUpdateFailureError.incompleteSubscription(this)
    }
  }

  /**
   * Make sure a price argument is provided when the subscription is a subscription with multiple prices.
   */
  guardAgainstMultiplePrices(): void {
    if (this.hasMultiplePrices()) {
      throw new InvalidArgumentError(
        'This method requires a price argument since the subscription has multiple prices.'
      )
    }
  }

  /**
   * Update the underlying Stripe subscription information for the model.
   */
  updateStripeSubscription(params: Stripe.SubscriptionUpdateParams): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(this.stripeId, params)
  }

  /**
   * Get the subscription as a Stripe subscription object.
   */
  asStripeSubscription(expand: string[] = []): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(this.stripeId, { expand })
  }
}
