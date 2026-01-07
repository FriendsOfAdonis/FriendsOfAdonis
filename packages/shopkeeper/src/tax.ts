import type Stripe from 'stripe'
import shopkeeper from '../services/shopkeeper.js'

export class Tax {
  /**
   * The total tax amount.
   */
  #amount: number

  /**
   * The applied currency.
   */
  #currency: string

  /**
   * The Stripe TaxRate object.
   */
  #taxRate: Stripe.TaxRate

  constructor(amount: number, currency: string, taxRate: Stripe.TaxRate) {
    this.#amount = amount
    this.#currency = currency
    this.#taxRate = taxRate
  }

  /**
   * Get the applied currency.
   */
  currency(): string {
    return this.#currency
  }

  /**
   * Get the total tax that was paid (or will be paid).
   */
  amount(): string {
    return this.formatAmount(this.#amount)
  }

  /**
   * Get the raw total tax that was paid (or will be paid).
   */
  rawAmount(): number {
    return this.#amount
  }

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string {
    return shopkeeper.formatAmount(amount, this.#currency)
  }

  /**
   * Determine if the tax is inclusive or not.
   */
  isInclusive(): boolean {
    return this.#taxRate.inclusive
  }

  taxRate(): Stripe.TaxRate {
    return this.#taxRate
  }
}
