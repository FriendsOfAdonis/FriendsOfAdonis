import { DateTime } from 'luxon'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { column, hasMany } from '@adonisjs/lucid/orm'
import { SubscriptionBuilder } from '../builders/subscription_builder.js'
import type { ManagesPaymentMethodsContract, ManagesSubscriptionsContract } from '../contracts.js'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Subscription from '../models/subscription.js'
import is from '@adonisjs/core/helpers/is'

export type ManagesSubscriptionsClass<
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesSubscriptionsContract }

export function managesSubscriptions() {
  return <
    T extends NormalizeConstructor<typeof BaseModel> & {
      new (...args: any[]): ManagesPaymentMethodsContract
    },
  >(
    superclass: T
  ): ManagesSubscriptionsClass<T> => {
    class EntityMixin extends superclass {
      @column.dateTime()
      declare trialEndsAt: DateTime | null

      @hasMany(() => Subscription)
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

      subscription(this: EntityMixin, type?: string): Promise<Subscription | null> {
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
      async onProduct(this: EntityMixin, product: string): Promise<boolean> {
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
      async onPrice(this: EntityMixin, price: string): Promise<boolean> {
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

      async applyCoupon(coupon: string, subscriptionTypes?: string | string[]): Promise<void> {
        const subscriptions = await this.#getActiveSubscriptions(subscriptionTypes)
        for (const subscription of subscriptions) {
          await subscription.applyCoupon(coupon)
        }
      }

      async applyPromotionCode(
        promotionCodeId: string,
        subscriptionTypes?: string | string[]
      ): Promise<void> {
        const subscriptions = await this.#getActiveSubscriptions(subscriptionTypes)
        for (const subscription of subscriptions) {
          await subscription.applyPromotionCode(promotionCodeId)
        }
      }

      async #getActiveSubscriptions(
        this: EntityMixin,
        types?: string | string[]
      ): Promise<Subscription[]> {
        const subscriptions = await this.related('subscriptions')
          .query()
          .if(!!types, (q) => {
            q.whereIn('type', is.array(types) ? types : [types!])
          })

        return subscriptions.filter((s) => s.active())
      }
    }

    return EntityMixin
  }
}
