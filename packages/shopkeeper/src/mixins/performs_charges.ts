import { type NormalizeConstructor } from '@poppinss/utils/types'
import { Payment } from '../payment.js'
import { Checkout } from '../checkout.js'
import type Stripe from 'stripe'
import { type WithManagesCustomer } from './manages_customer.js'
import { AllowsCoupon } from './allows_coupons.js'
import { compose } from '@adonisjs/core/helpers'

type Constructor = NormalizeConstructor<WithManagesCustomer>

export function PerformCharges<Model extends Constructor>(superclass: Model) {
  return class PerformChargesImpl extends compose(superclass, AllowsCoupon) {
    /**
     * Make a "one off" charge on the customer for the given amount.
     */
    async charge(
      amount: number,
      paymentMethod: string,
      params: Partial<Stripe.PaymentIntentCreateParams>
    ): Promise<Payment> {
      const payment = await this.createPayment(amount, {
        confirmation_method: 'automatic',
        confirm: true,
        payment_method: paymentMethod,
        ...params,
      })

      payment.validate()

      return payment
    }

    /**
     * Create a new PaymentIntent instance.
     */
    pay(
      amount: number,
      params: Partial<Omit<Stripe.PaymentIntentCreateParams, 'payment_method_types'>> = {}
    ): Promise<Payment> {
      return this.createPayment(amount, {
        automatic_payment_methods: {
          enabled: true,
        },
        ...params,
      })
    }

    /**
     * Create a new PaymentIntent instance for the given payment method types.
     */
    payWith(
      amount: number,
      paymentMethods: string[],
      params: Partial<Omit<Stripe.PaymentIntentCreateParams, 'automatic_payment_methods'>> = {}
    ): Promise<Payment> {
      return this.createPayment(amount, {
        payment_method_types: paymentMethods,
        ...params,
      })
    }

    /**
     * Create a new Payment instance with a Stripe PaymentIntent.
     */
    async createPayment(
      amount: number,
      params: Partial<Stripe.PaymentIntentCreateParams> = {}
    ): Promise<Payment> {
      return new Payment(
        await this.stripe.paymentIntents.create({
          customer: this.stripeId ?? undefined,
          currency: this.preferredCurrency(),
          amount,
          ...params,
        })
      )
    }

    /**
     * Find a payment intent by ID.
     */
    async findPayment(id: string): Promise<Payment | null> {
      const payment = await this.stripe.paymentIntents.retrieve(id)
      return payment ? new Payment(payment) : null
    }

    /**
     * Refund a customer for a charge.
     */
    refund(
      paymentIntent: string,
      params: Omit<Stripe.RefundCreateParams, 'payment_intent'> = {}
    ): Promise<Stripe.Refund> {
      return this.stripe.refunds.create({
        payment_intent: paymentIntent,
        ...params,
      })
    }

    /**
     * Begin a new checkout session for existing prices.
     */
    checkout(
      items:
        | Record<string, number>
        | string
        | string[]
        | Stripe.Checkout.SessionCreateParams.LineItem[],
      sessionParams: Stripe.Checkout.SessionCreateParams = {},
      customerParams: Stripe.CustomerCreateParams = {}
    ): Promise<Checkout> {
      // TODO: Avoid as any
      return Checkout.customer(this as any, this as any).create(
        items,
        sessionParams,
        customerParams
      )
    }

    /**
     * Begin a new checkout session for a "one-off" charge.
     */
    checkoutCharge(
      amount: number,
      name: string,
      quantity = 1,
      sessionParams: Stripe.Checkout.SessionCreateParams = {},
      customerParams: Stripe.CustomerCreateParams = {},
      productData: Omit<
        Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData,
        'name'
      > = {}
    ): Promise<Checkout> {
      return this.checkout(
        [
          {
            price_data: {
              currency: this.preferredCurrency(),
              product_data: {
                ...productData,
                name,
              },
              unit_amount: amount,
            },
            quantity,
          },
        ],
        sessionParams,
        customerParams
      )
    }
  }
}

export type WithPerformCharges = ReturnType<typeof PerformCharges>
