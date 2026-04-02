import type Stripe from 'stripe'
import { Shopkeeper } from './shopkeeper.js'

export class CustomerBalanceTransaction {
  /**
   * The Stripe CustomerBalanceTransaction instance.
   */
  #transaction: Stripe.CustomerBalanceTransaction

  constructor(transaction: Stripe.CustomerBalanceTransaction) {
    this.#transaction = transaction
  }

  /**
   * Get the total transaction amount.
   */
  amount(): string {
    return this.formatAmount(this.rawAmount())
  }

  /**
   * Get the raw total transaction amount.
   */
  rawAmount(): number {
    return this.#transaction.amount
  }

  /**
   * Get the ending balance.
   */
  endingBalance(): string {
    return this.formatAmount(this.rawEndingBalance())
  }

  /**
   * Get the raw ending balance.
   */
  rawEndingBalance(): number {
    return this.#transaction.ending_balance
  }

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string {
    return Shopkeeper.$instance.formatAmount(amount, this.#transaction.currency)
  }

  /**
   * Return the related invoice ID for this transaction.
   */
  invoiceId(): string | null {
    if (!this.#transaction.invoice) {
      return null
    }

    return typeof this.#transaction.invoice === 'string'
      ? this.#transaction.invoice
      : this.#transaction.invoice.id
  }

  /**
   * Get the Stripe CustomerBalanceTransaction instance.
   */
  asStripeCustomerBalanceTransaction(): Stripe.CustomerBalanceTransaction {
    return this.#transaction
  }
}
