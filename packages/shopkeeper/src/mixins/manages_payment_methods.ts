import type Stripe from 'stripe'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { column } from '@adonisjs/lucid/orm'
import { PaymentMethod } from '../payment_method.js'
import { Shopkeeper } from '../shopkeeper.js'
import type { ManagesCustomerContract, ManagesPaymentMethodsContract } from '../contracts.js'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

export type ManagesPaymentMethodsClass<
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesPaymentMethodsContract }

export function managesPaymentMethods() {
  return <
    T extends NormalizeConstructor<typeof BaseModel> & {
      new (...args: any[]): ManagesCustomerContract
    },
  >(
    superclass: T
  ): ManagesPaymentMethodsClass<T> => {
    class EntityMixin extends superclass {
      @column()
      declare pmType: string | null

      @column()
      declare pmLastFour: string | null

      async createSetupIntent(
        params: Stripe.SetupIntentCreateParams = {}
      ): Promise<Stripe.SetupIntent> {
        if (this.stripeId) {
          params.customer = this.stripeId
        }

        const stripe = await Shopkeeper.resolveStripe()
        return stripe.setupIntents.create(params)
      }

      async findSetupIntent(
        id: string,
        params?: Stripe.SetupIntentRetrieveParams,
        options?: Stripe.RequestOptions
      ): Promise<Stripe.SetupIntent> {
        const stripe = await Shopkeeper.resolveStripe()
        return stripe.setupIntents.retrieve(id, params, options)
      }

      hasDefaultPaymentMethod(): boolean {
        return !!this.pmType
      }

      async hasPaymentMethod(type?: Stripe.PaymentMethodListParams.Type): Promise<boolean> {
        const pms = await this.paymentMethods(type)
        return pms.length > 0
      }

      async paymentMethods(
        type?: Stripe.PaymentMethodListParams.Type,
        params: Stripe.PaymentMethodListParams = {}
      ): Promise<PaymentMethod[]> {
        if (!this.stripeId) {
          return []
        }

        const stripe = await Shopkeeper.resolveStripe()
        const paymentMethods = await stripe.paymentMethods.list({
          customer: this.stripeId,
          type,
          limit: 24,
          ...params,
        })

        return paymentMethods.data.map((pm) => new PaymentMethod(this, pm))
      }

      async addPaymentMethod(paymentMethod: string | Stripe.PaymentMethod): Promise<PaymentMethod> {
        const stripeId = this.stripeIdOrFail()
        let stripePaymentMethod = await this.resolveStripePaymentMethod(paymentMethod)

        if (stripePaymentMethod.customer !== this.stripeId) {
          const stripe = await Shopkeeper.resolveStripe()
          stripePaymentMethod = await stripe.paymentMethods.attach(stripePaymentMethod.id, {
            customer: stripeId,
          })
        }

        return new PaymentMethod(this, stripePaymentMethod)
      }

      async deletePaymentMethod(paymentMethod: string | Stripe.PaymentMethod): Promise<void> {
        const stripeId = this.stripeIdOrFail()
        const stripePaymentMethod = await this.resolveStripePaymentMethod(paymentMethod)

        if (stripePaymentMethod.customer !== stripeId) {
          return
        }

        const customer = await this.asStripeCustomer()

        const defaultPaymentMethod = customer.invoice_settings.default_payment_method

        const stripe = await Shopkeeper.resolveStripe()
        await stripe.paymentMethods.detach(stripePaymentMethod.id)

        if (stripePaymentMethod.id === defaultPaymentMethod) {
          this.pmType = null
          this.pmLastFour = null
          await this.save()
        }
      }

      async defaultPaymentMethod(): Promise<PaymentMethod | Stripe.CustomerSource | null> {
        if (!this.stripeId) {
          return null
        }

        const customer = await this.asStripeCustomer([
          'default_source',
          'invoice_settings.default_payment_method',
        ])

        const defaultPm = customer.invoice_settings.default_payment_method
        if (defaultPm && typeof defaultPm !== 'string') {
          return new PaymentMethod(this, defaultPm)
        }

        const defaultSource = customer.default_source
        if (!defaultSource || typeof defaultSource === 'string') {
          return null
        }
        return defaultSource
      }

      async updateDefaultPaymentMethod(
        paymentMethod: string | Stripe.PaymentMethod
      ): Promise<PaymentMethod> {
        const customer = await this.asStripeCustomer()
        const stripePaymentMethod = await this.resolveStripePaymentMethod(paymentMethod)

        if (stripePaymentMethod.id === customer.invoice_settings.default_payment_method) {
          return new PaymentMethod(this, stripePaymentMethod)
        }

        const pm = await this.addPaymentMethod(paymentMethod)

        await this.updateStripeCustomer({
          invoice_settings: {
            default_payment_method: pm.id,
          },
        })

        this.fillPaymentMethodDetails(pm)

        await this.save()

        return pm
      }

      async updateDefaultPaymentMethodFromStripe(): Promise<void> {
        const defaultPaymentMethod = await this.defaultPaymentMethod()
        if (defaultPaymentMethod) {
          if (defaultPaymentMethod instanceof PaymentMethod) {
            this.fillPaymentMethodDetails(defaultPaymentMethod.asStripePaymentMethod())
          } else {
            this.fillSourceDetails(defaultPaymentMethod)
          }
        } else {
          this.pmType = null
          this.pmLastFour = null
        }

        this.save()
      }

      /**
       * Fills the model's properties with the payment method from Stripe.
       */
      fillPaymentMethodDetails(paymentMethod: PaymentMethod | Stripe.PaymentMethod): void {
        if (paymentMethod.type === 'card' && paymentMethod.card) {
          this.pmType = paymentMethod.card.brand ?? null
          this.pmLastFour = paymentMethod.card.last4
        } else {
          this.pmType = paymentMethod.type
          const pmData: unknown = Reflect.get(paymentMethod, paymentMethod.type)
          this.pmLastFour =
            pmData &&
            typeof pmData === 'object' &&
            'last4' in pmData &&
            typeof pmData.last4 === 'string'
              ? pmData.last4
              : null
        }
      }

      /**
       * Fills the model's properties with the source from Stripe.
       */
      fillSourceDetails(source: Stripe.CustomerSource): void {
        if (source.object === 'card') {
          this.pmType = source.brand
          this.pmLastFour = source.last4
        } else if (source.object === 'bank_account') {
          this.pmType = 'Bank Account'
          this.pmLastFour = source.last4
        }
      }

      async deletePaymentMethods(type?: Stripe.PaymentMethodListParams.Type): Promise<void> {
        const paymentMethods = await this.paymentMethods(type)
        await Promise.all(paymentMethods.map((pm) => pm.delete()))
      }

      async findPaymentMethod(paymentMethod: string): Promise<PaymentMethod | null> {
        const stripePaymentMethod = await this.resolveStripePaymentMethod(paymentMethod).catch(
          () => null
        )

        return stripePaymentMethod ? new PaymentMethod(this, stripePaymentMethod) : null
      }

      /**
       * Resolve a PaymentMethod ID to a Stripe PaymentMethod object.
       */
      async resolveStripePaymentMethod(
        paymentMethod: string | Stripe.PaymentMethod
      ): Promise<Stripe.PaymentMethod> {
        if (typeof paymentMethod === 'string') {
          const stripe = await Shopkeeper.resolveStripe()
          return stripe.paymentMethods.retrieve(paymentMethod)
        }

        return paymentMethod
      }
    }

    return EntityMixin
  }
}
