import type Stripe from 'stripe'
import shopkeeper from '../services/shopkeeper.js'

export class Coupon {
  /**
   * The Stripe Coupon instance.
   */
  #coupon: Stripe.Coupon

  constructor(coupon: Stripe.Coupon) {
    this.#coupon = coupon
  }

  /**
   * Get the readable name for the Coupon.
   */
  name(): string {
    return this.#coupon.name ?? this.#coupon.id
  }

  /**
   * Determine if the coupon is a percentage.
   */
  isPercentage(): boolean {
    return !!this.#coupon.percent_off
  }

  /**
   * Get the discount percentage for the invoice.
   */
  percentOff(): number | null {
    return this.#coupon.percent_off
  }

  /**
   * Get the amount off for the coupon.
   */
  amountOff(): string | null {
    return this.#coupon.amount_off ? this.formatAmount(this.#coupon.amount_off) : null
  }

  /**
   * Get the raw amount off for the coupon.
   */
  rawAmountOff(): number | null {
    return this.#coupon.amount_off
  }

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string {
    return shopkeeper.formatAmount(amount, this.#coupon.currency ?? undefined)
  }

  /**
   * Get the Stripe Coupon instance.
   */
  asStripeCoupon(): Stripe.Coupon {
    return this.#coupon
  }
}
