import type Stripe from 'stripe'
import type { AllowsCouponContract } from '../contracts.js'
import { type Constructor } from '../types.js'

export type AllowsCouponClass<T extends Constructor> = T & {
  new (...args: any[]): AllowsCouponContract
}

export function allowsCoupon() {
  return <T extends Constructor>(superclass: T): AllowsCouponClass<T> => {
    class AllowsCouponImpl extends superclass {
      /**
       * The coupon ID being applied.
       */
      couponId?: string

      /**
       * The promotion code ID being applied.
       */
      promotionCodeId?: string

      /**
       * Determines if user redeemable promotion codes are available in Stripe Checkout.
       */
      allowPromotionCodes = false

      /**
       * The coupon ID to be applied.
       */
      withCoupon(couponId: string): this {
        this.couponId = couponId
        return this
      }

      /**
       * The promotion code ID to apply.
       */
      withPromotionCode(promotionCodeId: string): this {
        this.promotionCodeId = promotionCodeId
        return this
      }

      /**
       * Allows redeemable promotion codes in Stripe Checkout.
       */
      withAllowPromotionsCodes(): this {
        this.allowPromotionCodes = true
        return this
      }

      /**
       * Return the discounts for a Stripe Checkout session.
       */
      checkoutDiscounts(): Stripe.Checkout.SessionCreateParams.Discount[] | undefined {
        if (this.couponId) {
          return [{ coupon: this.couponId }]
        }

        if (this.promotionCodeId) {
          return [{ promotion_code: this.promotionCodeId }]
        }
      }
    }

    return AllowsCouponImpl
  }
}
