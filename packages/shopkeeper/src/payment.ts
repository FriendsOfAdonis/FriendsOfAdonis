import type Stripe from 'stripe'
import shopkeeper from '../services/shopkeeper.js'
import { type WithBillable } from './mixins/billable.js'
import { IncompletePaymentError } from './errors/incomplete_payment.js'

export class Payment {
  #paymentIntent: Stripe.PaymentIntent

  #customer?: WithBillable['prototype'] | null

  constructor(paymentIntent: Stripe.PaymentIntent) {
    this.#paymentIntent = paymentIntent
  }

  /**
   * Get the original Stripe PaymentIntent
   */
  get paymentIntent(): Stripe.PaymentIntent {
    return this.#paymentIntent
  }

  /**
   * Get the total amount that will be paid.
   */
  amount(): string {
    return this.formatAmount(this.rawAmount())
  }

  /**
   * Get the raw total amount that will be paid.
   */
  rawAmount(): number {
    return this.#paymentIntent.amount
  }

  /**
   * The Stripe PaymentIntent client secret.
   */
  clientSecret(): string | null {
    return this.#paymentIntent.client_secret
  }

  /**
   * Capture a payment that is being held for the customer.
   */
  async capture(params: Stripe.PaymentIntentCaptureParams = {}): Promise<void> {
    this.#paymentIntent = await shopkeeper.stripe.paymentIntents.capture(
      this.#paymentIntent.id,
      params
    )
  }

  /**
   * Determine if the payment needs a valid payment method.
   */
  requiresPaymentMethod(): boolean {
    return this.#paymentIntent.status === 'requires_payment_method'
  }

  /**
   * Determine if the payment needs an extra action like 3D Secure.
   */
  requiresAction(): boolean {
    return this.#paymentIntent.status === 'requires_action'
  }

  /**
   * Determine if the payment needs to be confirmed.
   */
  requiresConfirmation(): boolean {
    return this.#paymentIntent.status === 'requires_confirmation'
  }

  /**
   * Determine if the payment needs to be captured.
   */
  requireCaptures(): boolean {
    return this.#paymentIntent.status === 'requires_capture'
  }

  /**
   * Cancel the payment.
   */
  async cancel(params: Stripe.PaymentIntentCancelParams = {}): Promise<void> {
    this.#paymentIntent = await shopkeeper.stripe.paymentIntents.cancel(
      this.#paymentIntent.id,
      params
    )
  }

  /**
   * Determine if the payment was canceled.
   */
  isCanceled(): boolean {
    return this.#paymentIntent.status === 'canceled'
  }

  /**
   * Determine if the payment was successful.
   */
  isSucceeded(): boolean {
    return this.#paymentIntent.status === 'succeeded'
  }

  /**
   * Determine if the payment is processing.
   */
  isProcessing(): boolean {
    return this.#paymentIntent.status === 'processing'
  }

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string {
    return shopkeeper.formatAmount(amount, this.#paymentIntent.currency)
  }

  /**
   * Validate if the payment intent was successful and throw an exception if not.
   */
  validate(): true {
    if (this.requiresPaymentMethod()) {
      throw IncompletePaymentError.paymentMethodRequired(this)
    }

    if (this.requiresAction()) {
      throw IncompletePaymentError.requiresAction(this)
    }

    if (this.requiresConfirmation()) {
      throw IncompletePaymentError.requiresConfirmation(this)
    }

    return true
  }

  /**
   * Retrieve the related customer for the payment intent if one exists.
   */
  async customer(): Promise<WithBillable['prototype'] | null> {
    if (this.#customer !== undefined) {
      return this.#customer
    }

    if (!this.#paymentIntent.customer) {
      return null
    }

    this.#customer = await shopkeeper.findBillable(this.#paymentIntent.customer)
    return this.#customer
  }

  /**
   * Confirms the payment intent.
   */
  async confirm(params: Stripe.PaymentIntentConfirmParams = {}): Promise<this> {
    this.#paymentIntent = await shopkeeper.stripe.paymentIntents.confirm(
      this.#paymentIntent.id,
      params
    )
    return this
  }

  /**
   * The Stripe PaymentIntent instance.
   */
  async asStripePaymentIntent(expand?: string[]) {
    if (expand) {
      const customer = await this.customer()
      if (!customer) {
        throw new Error() // TODO: error handling
      }
      return customer.stripe.paymentIntents.retrieve(this.#paymentIntent.id, { expand })
    }

    return this.#paymentIntent
  }
}
