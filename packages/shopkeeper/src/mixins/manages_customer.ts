/// <reference types="@poppinss/hooks" />

import { InvalidCustomerError } from '../errors/invalid_customer.js'
import { CustomerAlreadyCreatedError } from '../errors/customer_already_created.js'
import shopkeeper from '../../services/shopkeeper.js'
import type Stripe from 'stripe'
import app from '@adonisjs/core/services/app'
import { Discount } from '../discount.js'
import { PromotionCode } from '../promotion_code.js'
import { CustomerBalanceTransaction } from '../customer_balance_transaction.js'
import { type ManagesStripeI, type WithManagesStripe } from './manages_stripe.js'
import { type NormalizeConstructor } from '@poppinss/utils/types'
import { type WithBillable } from './billable.js'

export interface ManagesCustomerI extends ManagesStripeI<true> {
  /**
   * Create a Stripe customer for the given model.
   */
  createAsStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>

  /**
   * Update the underlying Stripe customer information for the model.
   */
  updateStripeCustomer(params?: Stripe.CustomerUpdateParams): Promise<Stripe.Customer>

  /**
   * Get the Stripe customer instance for the current user or create one.
   */
  createOrGetStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>

  /**
   * Update the Stripe customer information for the current user or create one.
   */
  updateOrCreateStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>

  /**
   * Sync the customer's information to Stripe for the current user or create one.
   */
  syncOrCreateStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>

  /**
   * Get the Stripe customer for the model.
   */
  asStripeCustomer(expand?: string[]): Promise<Stripe.Customer>

  /**
   * Get the name that should be synced to Stripe.
   */
  stripeName(): string | undefined

  /**
   * Get the email address that should be synced to Stripe.
   */
  stripeEmail(): string | undefined

  /**
   * Get the phone number that should be synced to Stripe.
   */
  stripePhone(): string | undefined

  /**
   * Get the address that should be synced to Stripe.
   */
  stripeAddress(): Stripe.Emptyable<Stripe.AddressParam> | undefined

  /**
   * Get the locales that should be synced to Stripe.
   */
  stripePreferredLocales(): string[]

  /**
   * Get the metadata that should be synced to Stripe.
   */
  stripeMetadata(): Record<string, string>

  /**
   * Sync the customer's information to Stripe.
   */
  syncStripeCustomerDetails(): Promise<Stripe.Customer>

  /**
   * The discount that applies to the customer, if applicable.
   */
  discount(): Promise<Discount | null>

  /**
   * Apply a coupon to the customer.
   */
  applyCoupon(coupon: string): Promise<Stripe.Customer>

  /**
   * Apply a promotion code to the customer.
   */

  applyPromotionCode(promotionCodeId: string): Promise<Stripe.Customer>

  /**
   * Retrieve a promotion code by its code.
   */
  findPromotionCode(
    code: string,
    params?: Stripe.PromotionCodeListParams
  ): Promise<PromotionCode | null>

  /**
   * Retrieve an active promotion code by its code.
   */
  findActivePromotionCode(
    code: string,
    params?: Stripe.PromotionCodeListParams
  ): Promise<PromotionCode | null>

  /**
   * Get the total balance of the customer.
   */
  balance(): Promise<string>

  /**
   * Get the raw total balance of the customer.
   */
  rawBalance(): Promise<number>

  /**
   * Return a customer's balance transactions.
   */
  balanceTransaction(
    limit?: number,
    params?: Stripe.CustomerListBalanceTransactionsParams
  ): Promise<CustomerBalanceTransaction[]>

  /**
   * Credit a customer's balance.
   */
  creditBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>

  /**
   * Debit a customer's balance.
   */
  debitBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>

  /**
   * Apply a new amount to the customer's balance.
   */
  applyBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>

  /**
   * Get the Stripe supported currency used by the customer.
   */
  preferredCurrency(): string

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string

  /**
   * Get the Stripe billing portal for this customer.
   */
  billingPortalUrl(
    returnUrl?: string,
    params?: Stripe.BillingPortal.SessionCreateParams
  ): Promise<string>

  /**
   * Get a collection of the customer's TaxID's.
   */
  taxIds(params?: Stripe.CustomerListTaxIdsParams): Promise<Stripe.TaxId[]>

  /**
   * Find a TaxID by ID.
   */
  findTaxId(id: string): Promise<Stripe.TaxId | null>

  /**
   * Create a TaxID for the customer.
   */
  createTaxId(type: Stripe.CustomerCreateTaxIdParams.Type, value: string): Promise<Stripe.TaxId>

  /**
   * Delete a TaxID for the customer.
   */
  deleteTaxId(id: string): Promise<void>

  /**
   * Determine if the customer is not exempted from taxes.
   */
  isNotTaxExempt(): Promise<boolean>

  /**
   * Determine if the customer is exempted from taxes.
   */
  isTaxExempt(): Promise<boolean>

  /**
   * Determine if reverse charge applies to the customer.
   */
  reverseChargeApplies(): Promise<boolean>

  /**
   * Get the Stripe SDK client.
   */
  get stripe(): Stripe
}

type Constructor = NormalizeConstructor<WithManagesStripe>

export function ManagesCustomer<Model extends Constructor>(superclass: Model) {
  return class WithManagesCustomerImpl extends superclass implements ManagesCustomerI {
    async createAsStripeCustomer(
      params: Stripe.CustomerCreateParams = {}
    ): Promise<Stripe.Customer> {
      const p = { ...params }

      if (this.hasStripeId()) {
        throw new CustomerAlreadyCreatedError()
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

      const customer = await this.stripe.customers.create(p)

      this.stripeId = customer.id

      await this.save()

      return customer
    }

    updateStripeCustomer(params: Stripe.CustomerUpdateParams): Promise<Stripe.Customer> {
      const stripeId = this.stripeIdOrFail()
      return this.stripe.customers.update(stripeId, params)
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

    syncOrCreateStripeCustomer(params: Stripe.CustomerCreateParams = {}): Promise<Stripe.Customer> {
      if (this.hasStripeId()) {
        return this.updateStripeCustomer(params)
      }

      return this.createAsStripeCustomer(params)
    }

    async asStripeCustomer(expand?: string[]): Promise<Stripe.Customer> {
      const stripeId = this.stripeIdOrFail()
      const customer = await this.stripe.customers.retrieve(stripeId, { expand })

      if (customer.deleted) {
        throw new InvalidCustomerError()
      }

      return customer
    }

    stripeName(): string | undefined {
      return ('name' in this ? this.name : undefined) as string | undefined
    }

    stripeEmail(): string | undefined {
      return ('email' in this ? this.email : undefined) as string | undefined
    }

    stripePhone(): string | undefined {
      return ('phone' in this ? this.phone : undefined) as string | undefined
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
      const customer = await this.asStripeCustomer(['discount.promotion_code'])
      return customer.discount ? new Discount(customer.discount) : null
    }

    async applyCoupon(coupon: string): Promise<Stripe.Customer> {
      return this.updateStripeCustomer({
        coupon: coupon,
      })
    }

    async applyPromotionCode(promotionCodeId: string): Promise<Stripe.Customer> {
      return this.updateStripeCustomer({
        promotion_code: promotionCodeId,
      })
    }

    async findPromotionCode(
      code: string,
      params: Stripe.PromotionCodeListParams = {}
    ): Promise<PromotionCode | null> {
      const codes = await this.stripe.promotionCodes.list({
        code,
        limit: 1,
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

      const transactions = await this.stripe.customers.listBalanceTransactions(this.stripeId, {
        limit,
        ...params,
      })

      // TODO: Fix as unknown
      return transactions.data.map(
        (transaction) =>
          new CustomerBalanceTransaction(this as unknown as WithBillable['prototype'], transaction)
      )
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

      const transaction = await this.stripe.customers.createBalanceTransaction(this.stripeId, {
        amount,
        currency: this.preferredCurrency(),
        description,
        ...params,
      })

      // TODO: Fix as any
      return new CustomerBalanceTransaction(this as any, transaction)
    }

    preferredCurrency(): string {
      return app.config.get('shopkeeper.currency')
    }

    formatAmount(amount: number): string {
      return shopkeeper.formatAmount(amount, this.preferredCurrency())
    }

    async billingPortalUrl(
      returnUrl: string,
      params: Partial<Stripe.BillingPortal.SessionCreateParams> = {}
    ): Promise<string> {
      if (!this.stripeId) {
        throw new InvalidCustomerError()
      }

      return this.stripe.billingPortal.sessions
        .create({
          customer: this.stripeId,
          return_url: returnUrl,
          ...params,
        })
        .then((r) => r.url)
    }

    async taxIds(params?: Stripe.CustomerListTaxIdsParams): Promise<Stripe.TaxId[]> {
      const stripeId = this.stripeIdOrFail()
      const res = await this.stripe.customers.listTaxIds(stripeId, params)
      return res.data
    }

    async findTaxId(id: string): Promise<Stripe.TaxId | null> {
      const stripeId = this.stripeIdOrFail()
      try {
        return await this.stripe.customers.retrieveTaxId(stripeId, id)
      } catch {
        return null
      }
    }

    createTaxId(type: Stripe.CustomerCreateTaxIdParams.Type, value: string): Promise<Stripe.TaxId> {
      const stripeId = this.stripeIdOrFail()
      return this.stripe.customers.createTaxId(stripeId, {
        type,
        value,
      })
    }

    async deleteTaxId(id: string): Promise<void> {
      const stripeId = this.stripeIdOrFail()
      await this.stripe.customers.deleteTaxId(stripeId, id)
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

    get stripe(): Stripe {
      return shopkeeper.stripe
    }
  }
}

export type WithManagesCustomer = ReturnType<typeof ManagesCustomer>
