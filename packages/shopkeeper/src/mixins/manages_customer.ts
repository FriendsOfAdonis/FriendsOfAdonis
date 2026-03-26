/// <reference types="@poppinss/hooks" />

import { InvalidCustomerError } from '../errors/invalid_customer.js'
import { Shopkeeper } from '../shopkeeper.js'
import type Stripe from 'stripe'
import app from '@adonisjs/core/services/app'
import { Discount } from '../discount.js'
import { PromotionCode } from '../promotion_code.js'
import { CustomerBalanceTransaction } from '../customer_balance_transaction.js'
import type { ManagesCustomerContract, ManagesStripeContract } from '../contracts.js'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { CustomerAlreadyCreatedError } from '../errors/customer_already_created.js'

export type ManagesCustomerClass<
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesCustomerContract }

export function managesCustomer() {
  return <
    T extends NormalizeConstructor<typeof BaseModel> & {
      new (...args: any[]): ManagesStripeContract
    },
  >(
    superclass: T
  ): ManagesCustomerClass<T> => {
    class EntityMixin extends superclass {
      async createAsStripeCustomer(
        params: Stripe.CustomerCreateParams = {}
      ): Promise<Stripe.Customer> {
        const p = { ...params }

        if (this.hasStripeId()) {
          throw CustomerAlreadyCreatedError.alreadyCreated(this)
        }

        if (!p.name) {
          p.name = this.stripeName()
        }

        if (!p.email) {
          p.email = this.stripeEmail()
        }

        if (!p.phone) {
          p.phone = this.stripePhone()
        }

        if (!p.address) {
          p.address = this.stripeAddress()
        }

        if (!p.preferred_locales) {
          p.preferred_locales = this.stripePreferredLocales()
        }

        if (!p.metadata) {
          p.metadata = this.stripeMetadata()
        }

        const stripe = Shopkeeper.stripe
        const customer = await stripe.customers.create(p)

        this.stripeId = customer.id

        await this.save()

        return customer
      }

      async updateStripeCustomer(params: Stripe.CustomerUpdateParams): Promise<Stripe.Customer> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        return stripe.customers.update(stripeId, params)
      }

      createOrGetStripeCustomer(params: Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
        if (this.hasStripeId()) {
          return this.asStripeCustomer(params.expand)
        }

        return this.createAsStripeCustomer(params)
      }

      updateOrCreateStripeCustomer(params: Stripe.CustomerCreateParams) {
        if (this.hasStripeId()) {
          return this.updateStripeCustomer(params)
        }

        return this.createAsStripeCustomer(params)
      }

      syncOrCreateStripeCustomer(
        params: Stripe.CustomerCreateParams = {}
      ): Promise<Stripe.Customer> {
        if (this.hasStripeId()) {
          return this.updateStripeCustomer(params)
        }

        return this.createAsStripeCustomer(params)
      }

      async asStripeCustomer(expand?: string[]): Promise<Stripe.Customer> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        const customer = await stripe.customers.retrieve(stripeId, { expand })

        if (customer.deleted) {
          throw new InvalidCustomerError()
        }

        return customer
      }

      stripeName(): string | undefined {
        if ('name' in this) {
          const val = this.name
          return typeof val === 'string' ? val : undefined
        }
        return undefined
      }

      stripeEmail(): string | undefined {
        if ('email' in this) {
          const val = this.email
          return typeof val === 'string' ? val : undefined
        }
        return undefined
      }

      stripePhone(): string | undefined {
        if ('phone' in this) {
          const val = this.phone
          return typeof val === 'string' ? val : undefined
        }
        return undefined
      }

      stripeAddress(): Stripe.Emptyable<Stripe.AddressParam> {
        return {}
      }

      stripePreferredLocales(): string[] {
        return []
      }

      stripeMetadata(): Record<string, string> {
        return {}
      }

      syncStripeCustomerDetails(): Promise<Stripe.Customer> {
        return this.updateStripeCustomer({
          name: this.stripeName(),
          email: this.stripeEmail(),
          phone: this.stripePhone(),
          address: this.stripeAddress(),
          preferred_locales: this.stripePreferredLocales(),
          metadata: this.stripeMetadata(),
        })
      }

      async discount(): Promise<Discount | null> {
        const customer = await this.asStripeCustomer([
          'discount.promotion_code',
          'discount.source.coupon',
        ])
        return customer.discount ? new Discount(customer.discount) : null
      }

      async findPromotionCode(
        code: string,
        params: Stripe.PromotionCodeListParams = {}
      ): Promise<PromotionCode | null> {
        const stripe = Shopkeeper.stripe
        const codes = await stripe.promotionCodes.list({
          code,
          limit: 1,
          expand: ['data.promotion.coupon'],
          ...params,
        })

        const pc = codes.data[0]
        return pc ? new PromotionCode(pc) : null
      }

      findActivePromotionCode(
        code: string,
        params?: Stripe.PromotionCodeListParams
      ): Promise<PromotionCode | null> {
        return this.findPromotionCode(code, { active: true, ...params })
      }

      async balance(): Promise<string> {
        return this.formatAmount(await this.rawBalance())
      }

      /**
       * Get the raw total balance of the customer.
       */
      public async rawBalance(): Promise<number> {
        if (!this.hasStripeId()) {
          return 0
        }

        return this.asStripeCustomer().then((c) => c.balance)
      }

      async balanceTransaction(
        limit = 10,
        params: Stripe.CustomerListBalanceTransactionsParams = {}
      ): Promise<CustomerBalanceTransaction[]> {
        if (!this.stripeId) {
          return []
        }

        const stripe = Shopkeeper.stripe
        const transactions = await stripe.customers.listBalanceTransactions(this.stripeId, {
          limit,
          ...params,
        })

        return transactions.data.map((transaction) => new CustomerBalanceTransaction(transaction))
      }

      creditBalance(
        amount: number,
        description?: string,
        params: Partial<Stripe.CustomerCreateBalanceTransactionParams> = {}
      ): Promise<CustomerBalanceTransaction> {
        return this.applyBalance(-amount, description, params)
      }

      debitBalance(
        amount: number,
        description?: string,
        params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
      ): Promise<CustomerBalanceTransaction> {
        return this.applyBalance(amount, description, params)
      }

      async applyBalance(
        amount: number,
        description?: string,
        params: Partial<Stripe.CustomerCreateBalanceTransactionParams> = {}
      ): Promise<CustomerBalanceTransaction> {
        if (!this.stripeId) {
          throw new InvalidCustomerError()
        }

        const stripe = Shopkeeper.stripe
        const transaction = await stripe.customers.createBalanceTransaction(this.stripeId, {
          amount,
          currency: this.preferredCurrency(),
          description,
          ...params,
        })

        return new CustomerBalanceTransaction(transaction)
      }

      preferredCurrency(): string {
        return app.config.get('shopkeeper.currency')
      }

      formatAmount(amount: number): string {
        return Shopkeeper.formatter.formatAmount(amount, this.preferredCurrency())
      }

      async billingPortalUrl(
        returnUrl: string,
        params: Partial<Stripe.BillingPortal.SessionCreateParams> = {}
      ): Promise<string> {
        if (!this.stripeId) {
          throw new InvalidCustomerError()
        }

        const stripe = Shopkeeper.stripe
        return stripe.billingPortal.sessions
          .create({
            customer: this.stripeId,
            return_url: returnUrl,
            ...params,
          })
          .then((r) => r.url)
      }

      async taxIds(params?: Stripe.CustomerListTaxIdsParams): Promise<Stripe.TaxId[]> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        const res = await stripe.customers.listTaxIds(stripeId, params)
        return res.data
      }

      async findTaxId(id: string): Promise<Stripe.TaxId | null> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        try {
          return await stripe.customers.retrieveTaxId(stripeId, id)
        } catch {
          return null
        }
      }

      async createTaxId(
        type: Stripe.CustomerCreateTaxIdParams.Type,
        value: string
      ): Promise<Stripe.TaxId> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        return stripe.customers.createTaxId(stripeId, {
          type,
          value,
        })
      }

      async deleteTaxId(id: string): Promise<void> {
        const stripe = Shopkeeper.stripe
        const stripeId = this.stripeIdOrFail()
        await stripe.customers.deleteTaxId(stripeId, id)
      }

      async isNotTaxExempt(): Promise<boolean> {
        const customer = await this.asStripeCustomer()
        return customer.tax_exempt === 'none'
      }

      async isTaxExempt(): Promise<boolean> {
        const customer = await this.asStripeCustomer()
        return customer.tax_exempt === 'exempt'
      }

      async reverseChargeApplies(): Promise<boolean> {
        const customer = await this.asStripeCustomer()
        return customer.tax_exempt === 'reverse'
      }
    }

    return EntityMixin
  }
}
