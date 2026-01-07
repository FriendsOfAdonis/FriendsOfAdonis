import type Stripe from 'stripe'
import { Coupon } from './coupon.js'

export class PromotionCode {
  /**
   * The Stripe PromotionCode instance.
   */
  #promotionCode: Stripe.PromotionCode

  constructor(promotionCode: Stripe.PromotionCode) {
    this.#promotionCode = promotionCode
  }

  /**
   * Get the coupon that belongs to the promotion code.
   */
  coupon(): Coupon {
    return new Coupon(this.#promotionCode.coupon)
  }

  /**
   * Get the promotion code code.
   */
  code(): string {
    return this.#promotionCode.code
  }

  /**
   * Get the Stripe PromotionCode instance.
   */
  asStripePromotionCode(): Stripe.PromotionCode {
    return this.#promotionCode
  }
}
