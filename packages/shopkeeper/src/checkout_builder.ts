import { compose } from '@adonisjs/core/helpers'
import { Empty } from './types.js'
import { AllowsCoupon } from './mixins/allows_coupons.js'
import { HandlesTaxes } from './mixins/handles_taxes.js'
import { type WithBillable } from './mixins/billable.js'
import { type SubscriptionBuilder } from './subscription_builder.js'
import type Stripe from 'stripe'
import { Checkout } from './checkout.js'
import shopkeeper from '../services/shopkeeper.js'

export class CheckoutBuilder extends compose(Empty, AllowsCoupon, HandlesTaxes) {
  #owner?: WithBillable['prototype']

  // TODO: Find better way to check for mixins
  constructor(owner?: WithBillable['prototype'], parentInstance?: SubscriptionBuilder) {
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
  static make(owner?: WithBillable['prototype'], instance?: any) {
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
            (shopkeeper.config.calculateTaxes ?? this.collectTaxIds)
              ? { enabled: true }
              : undefined,
        },
        ...sessionParams,
      },
      customerParams
    )
  }
}
