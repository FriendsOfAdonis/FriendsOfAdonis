import { compose } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { Empty, type ShopkeeperConfig } from './types.js'
import { allowsCoupon } from './mixins/allows_coupons.js'
import { handlesTaxes } from './mixins/handles_taxes.js'
import { type ManagesCustomerContract } from './contracts.js'
import { type SubscriptionBuilder } from './subscription_builder.js'
import type Stripe from 'stripe'
import { Checkout } from './checkout.js'

export class CheckoutBuilder extends compose(Empty, allowsCoupon(), handlesTaxes()) {
  #owner?: ManagesCustomerContract

  constructor(owner?: ManagesCustomerContract, parentInstance?: SubscriptionBuilder) {
    super()
    this.#owner = owner

    if (parentInstance && 'couponId' in parentInstance) {
      this.couponId = parentInstance.couponId
      this.promotionCodeId = parentInstance.promotionCodeId
      this.allowPromotionCodes = parentInstance.allowPromotionCodes
    }

    if (parentInstance && 'customerIpAddress' in parentInstance) {
      this.customerIpAddress = parentInstance.customerIpAddress
      this.estimationBillingAddress = parentInstance.estimationBillingAddress
      this.collectTaxIds = parentInstance.collectTaxIds
    }
  }

  /**
   * Create a new checkout builder instance.
   */
  static make(owner?: ManagesCustomerContract, instance?: SubscriptionBuilder) {
    return new this(owner, instance)
  }

  /**
   * Create a new checkout session.
   */
  async create(
    items:
      | Record<string, number>
      | string
      | string[]
      | Stripe.Checkout.SessionCreateParams.LineItem[],
    sessionParams: Stripe.Checkout.SessionCreateParams = {},
    customerParams: Stripe.CustomerCreateParams = {}
  ): Promise<Checkout> {
    items = typeof items === 'string' ? [items] : items
    const discounts = this.checkoutDiscounts()
    return Checkout.create(
      this.#owner,
      {
        ...{
          allow_promotion_codes: discounts ? undefined : this.allowPromotionCodes,
          automatic_tax: this.automaticTaxPayload(),
          discounts,
          line_items: Object.entries(items).map(
            ([key, value]: [
              string,
              number | string | Stripe.Checkout.SessionCreateParams.LineItem,
            ]) => {
              if (typeof value === 'number') {
                return { price: key, quantity: value }
              }

              const item = typeof value === 'string' ? { price: value } : value
              item.quantity = item.quantity ?? 1
              return item
            }
          ),
          tax_id_collection:
            (app.config.get<ShopkeeperConfig>('shopkeeper').calculateTaxes ?? this.collectTaxIds)
              ? { enabled: true }
              : undefined,
        },
        ...sessionParams,
      },
      customerParams
    )
  }
}
