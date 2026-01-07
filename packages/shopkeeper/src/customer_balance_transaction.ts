import type Stripe from 'stripe'
import { type Invoice } from './invoice.js'
import { type WithBillable } from './mixins/billable.js'
import shopkeeper from '../services/shopkeeper.js'

export class CustomerBalanceTransaction {
  /**
   * The Stripe model instance.
   */
  #owner: WithBillable['prototype']

  /**
   * The Stripe CustomerBalanceTransaction instance.
   */
  #transaction: Stripe.CustomerBalanceTransaction

  constructor(owner: WithBillable['prototype'], transaction: Stripe.CustomerBalanceTransaction) {
    // TODO: assert owner of transaction
    this.#owner = owner
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
    return shopkeeper.formatAmount(amount, this.#transaction.currency)
  }

  /**
   * Return the related invoice for this transaction.
   */
  async invoice(): Promise<Invoice | null> {
    return this.#transaction.invoice
      ? this.#owner.findInvoice(this.#transaction.invoice as string)
      : null
  }

  /**
   * Get the Stripe CustomerBalanceTransaction instance.
   */
  asStripeCustomerBalanceTransaction(): Stripe.CustomerBalanceTransaction {
    return this.#transaction
  }
}
