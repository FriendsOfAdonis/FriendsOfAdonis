import { DateTime } from 'luxon'
import type Stripe from 'stripe'
import { PromotionCode } from './promotion_code.js'
import { Coupon } from './coupon.js'

export class Discount {
  /**
   * The Stripe Discount instance.
   */
  #discount: Stripe.Discount

  constructor(discount: Stripe.Discount) {
    this.#discount = discount
  }

  /**
   * Get the Stripe Discount instance.
   */
  get stripeDiscount(): Stripe.Discount {
    return this.#discount
  }

  /**
   * Get the coupon applied to the discount.
   */
  coupon(): Coupon {
    return new Coupon(this.#discount.coupon)
  }

  /**
   * Get the promotion code applied to create this discount.
   */
  promotionCode(): PromotionCode | null {
    if (this.#discount.promotion_code && typeof this.#discount.promotion_code === 'object') {
      return new PromotionCode(this.#discount.promotion_code)
    }

    return null
  }

  /**
   * Get the date that the coupon was applied.
   */
  start(): DateTime {
    return DateTime.fromSeconds(this.#discount.start)
  }

  /**
   * Get the date that this discount will end.
   */
  end(): DateTime | null {
    return this.#discount.end ? DateTime.fromSeconds(this.#discount.end) : null
  }

  /**
   * Get the Stripe Discount instance.
   */
  asStripeDiscount(): Stripe.Discount {
    return this.#discount
  }
}
