import { Exception } from '@adonisjs/core/exceptions'
import type Stripe from 'stripe'
import { InvalidPaymentError } from './errors/invalid_payment.js'
import { type ManagesPaymentMethodsI } from './contracts.js'

export class PaymentMethod {
  /**
   * The Stripe model instance.
   */
  #owner: ManagesPaymentMethodsI

  /**
   * The Stripe PaymentMethod instance.
   */
  #paymentMethod: Stripe.PaymentMethod

  constructor(owner: ManagesPaymentMethodsI, paymentMethod: Stripe.PaymentMethod) {
    if (!paymentMethod.customer) {
      throw new Exception('The payment method is not attached to a customer.')
    }

    if (owner.stripeId !== paymentMethod.customer) {
      throw InvalidPaymentError.invalidOwner(paymentMethod, owner)
    }

    this.#owner = owner
    this.#paymentMethod = paymentMethod

    Object.assign(this, paymentMethod)
  }

  /**
   * Delete the payment method.
   */
  delete(): Promise<void> {
    return this.#owner.deletePaymentMethod(this.#paymentMethod)
  }

  /**
   * Get the Stripe model instance.
   */
  owner(): ManagesPaymentMethodsI {
    return this.#owner
  }

  /**
   * Get the Stripe PaymentMethod instance.
   */
  asStripePaymentMethod(): Stripe.PaymentMethod {
    return this.#paymentMethod
  }
}

export interface PaymentMethod extends Stripe.PaymentMethod {}
