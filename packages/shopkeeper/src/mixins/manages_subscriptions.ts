import { DateTime } from 'luxon'
import { SubscriptionBuilder } from '../subscription_builder.js'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import Subscription from '../models/subscription.js'
import { type WithManagesPaymentMethods } from './manages_payment_methods.js'
import { type NormalizeConstructor } from '@poppinss/utils/types'
import is from '@adonisjs/core/helpers/is'

export interface ManagesSubscriptionsI {
  trialEndsAt: DateTime | null
  subscriptions: HasMany<typeof Subscription>

  /**
   * Begin creating a new subscription.
   */
  newSubscription(type: string, prices?: string[]): SubscriptionBuilder

  /**
   * Determine if the Stripe model is on trial.
   */
  onTrial(type?: string, price?: string): Promise<boolean>

  /**
   * Determine if the Stripe model's trial has ended.
   */
  hasExpiredTrial(type?: string, price?: string): Promise<boolean>

  /**
   * Determine if the Stripe model is on a "generic" trial at the model level.
   */
  onGenericTrial(): boolean

  /**
   * Determine if the Stripe model's "generic" trial at the model level has expired.
   */
  hasExpiredGenericTrial(): boolean

  /**
   * Get the ending date of the trial.
   */
  getTrialEndsAt(type?: string): Promise<DateTime | null>

  /**
   * Determine if the Stripe model has a given subscription.
   */
  subscribed(type?: string, price?: string): Promise<boolean>

  /**
   * Get a subscription instance by $type.
   */
  subscription(type?: string): Promise<Subscription | null>

  /**
   * Determine if the Stripe model is actively subscribed to one of the given products.
   */
  subscribedToProduct(products: string[], type: string): Promise<boolean>

  /**
   * Determine if the Stripe model is actively subscribed to one of the given prices.
   */
  subscribedToPrice(prices: string[], type: string): Promise<boolean>

  /**
   * Get the tax rates to apply to the subscription.
   */
  taxRates(): string[]

  /**
   * Get the tax rates to apply to individual subscription items.
   */
  priceTaxRates(): Record<string, string[]>
}

type Constructor = NormalizeConstructor<WithManagesPaymentMethods>

export function ManagesSubscriptions<Model extends Constructor>(superclass: Model) {
  class WithManagesSubscriptionsImpl extends superclass implements ManagesSubscriptionsI {
    declare trialEndsAt: DateTime | null
    declare subscriptions: HasMany<typeof Subscription>

    newSubscription(type: string, prices: string | string[] = []): SubscriptionBuilder {
      prices = is.array(prices) ? prices : [prices]
      return new SubscriptionBuilder(this, type, prices)
    }

    async onTrial(type = 'default', price?: string): Promise<boolean> {
      if (type === 'default' && this.onGenericTrial()) {
        return true
      }

      const subscription = await this.subscription(type)

      if (!subscription || subscription.onTrial()) {
        return false
      }

      return !price || subscription.hasPrice(price)
    }

    async hasExpiredTrial(type = 'default', price?: string): Promise<boolean> {
      if (type === 'default' && this.hasExpiredGenericTrial()) {
        return true
      }

      const subscription = await this.subscription(type)

      if (!subscription || !subscription.hasExpiredTrial()) {
        return false
      }

      return !price || subscription.hasPrice(price)
    }

    onGenericTrial(): boolean {
      return this.trialEndsAt ? this.trialEndsAt > DateTime.now() : false
    }

    hasExpiredGenericTrial(): boolean {
      return this.trialEndsAt ? this.trialEndsAt < DateTime.now() : false
    }

    async getTrialEndsAt(type = 'default'): Promise<DateTime | null> {
      if (type === 'default' && this.onGenericTrial()) {
        return this.trialEndsAt
      }

      const subscription = await this.subscription(type)
      return subscription ? subscription.trialEndsAt : this.trialEndsAt
    }

    async subscribed(type?: string, price?: string): Promise<boolean> {
      const subscription = await this.subscription(type)

      if (!subscription || !subscription.valid()) {
        return false
      }

      return !price || subscription.hasPrice(price)
    }

    subscription(type?: string): Promise<Subscription | null> {
      // @ts-ignore -- Lucid type issue
      return this.related('subscriptions')
        .query()
        .if(!!type, (q) => q.where('type', type!))
        .first()
    }

    async subscribedToProduct(products: string[], type = 'default'): Promise<boolean> {
      const subscription = await this.subscription(type)

      if (!subscription || !subscription.valid()) {
        return false
      }

      for (const product of products) {
        if (await subscription.hasProduct(product)) {
          return true
        }
      }

      return false
    }

    async subscribedToPrice(prices: string[], type: string): Promise<boolean> {
      const subscription = await this.subscription(type)

      if (!subscription || !subscription.valid()) {
        return false
      }

      for (const price of prices) {
        if (await subscription.hasPrice(price)) {
          return true
        }
      }

      return false
    }

    /**
     * Determine if the customer has a valid subscription on the given product.
     */
    async onProduct(product: string): Promise<boolean> {
      // @ts-ignore -- Lucid type issue
      await this.load('subscriptions')

      for (const subscription of this.subscriptions) {
        if (await subscription.hasProduct(product)) {
          return true
        }
      }

      return false
    }

    /**
     * Determine if the customer has a valid subscription on the given price.
     */
    async onPrice(price: string): Promise<boolean> {
      // @ts-ignore -- Lucid type issue
      await this.load('subscriptions')

      for (const subscription of this.subscriptions) {
        if (await subscription.hasPrice(price)) {
          return true
        }
      }

      return false
    }

    taxRates(): string[] {
      return []
    }

    priceTaxRates(): Record<string, string[]> {
      return {}
    }
  }

  WithManagesSubscriptionsImpl.boot()
  WithManagesSubscriptionsImpl.$addRelation('subscriptions', 'hasMany', () => Subscription, {})

  return WithManagesSubscriptionsImpl
}

export type WithManagesSubscriptions = ReturnType<typeof ManagesSubscriptions>
