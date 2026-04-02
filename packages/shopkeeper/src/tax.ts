import { Shopkeeper } from './shopkeeper.js'

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
   * The Stripe TaxRate ID.
   */
  #taxRateId: string | null

  constructor(amount: number, currency: string, taxRateId: string | null) {
    this.#amount = amount
    this.#currency = currency
    this.#taxRateId = taxRateId
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
    return Shopkeeper.$instance.formatAmount(amount, this.#currency)
  }

  /**
   * Get the tax rate ID.
   */
  taxRateId(): string | null {
    return this.#taxRateId
  }
}
