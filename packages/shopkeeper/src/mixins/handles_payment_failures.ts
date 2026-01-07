import type Stripe from 'stripe'
import type Subscription from '../models/subscription.js'
import { IncompletePaymentError } from '../errors/incomplete_payment.js'
import { checkStripeError } from '../utils/errors.js'
import { Payment } from '../payment.js'

type Constructor = new (...args: any[]) => {}

export function HandlesPaymentFailures<Model extends Constructor>(superclass: Model) {
  return class HandlesPaymentFailuresImpl extends superclass {
    /**
     * Indicates if incomplete payments should be confirmed automatically.
     */
    confirmIncompletePayment = true

    /**
     * The options to be used when confirming a payment intent.
     */
    paymentConfirmationOptions: Stripe.PaymentIntentConfirmParams = {}

    /**
     * Handle a failed payment for the given subscription.
     */
    async handlePaymentFailure(
      subscription: Subscription,
      paymentMethod?: Stripe.PaymentMethod | string
    ): Promise<void> {
      if (this.confirmIncompletePayment && subscription.hasIncompletePayment()) {
        try {
          const payment = await subscription.latestPayment()
          payment!.validate()
        } catch (e) {
          if (e instanceof IncompletePaymentError) {
            if (e.payment.requiresConfirmation()) {
              let paymentIntent: Stripe.PaymentIntent
              try {
                paymentIntent = await e.payment
                  .confirm({
                    ...this.paymentConfirmationOptions,
                    expand: ['invoice.subscription'],
                    payment_method:
                      typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id,
                  })
                  .then((p) => p.asStripePaymentIntent())
              } catch (e2) {
                checkStripeError(e2, 'StripeCardError')
                paymentIntent = await e.payment.asStripePaymentIntent(['invoice.subscription'])
              }

              subscription.stripeStatus = (paymentIntent.invoice as any).subscription.status
              await subscription.save()

              if (subscription.hasIncompletePayment()) {
                new Payment(paymentIntent).validate()
              }
            }
          } else {
            throw e
          }
        }
      }

      this.confirmIncompletePayment = true
      this.paymentConfirmationOptions = {}
    }

    /**
     * Prevent automatic confirmation of incomplete payments.
     */
    ignoreIncompletePayments(): this {
      this.confirmIncompletePayment = false
      return this
    }

    /**
     * Specify the options to be used when confirming a payment intent.
     */
    withPaymentConfirmationOptions(params: Stripe.PaymentIntentConfirmParams): this {
      this.paymentConfirmationOptions = params
      return this
    }
  }
}

export type WithHandlesPaymentFailures = ReturnType<typeof HandlesPaymentFailures>['prototype']
