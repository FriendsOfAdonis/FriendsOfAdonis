import type Stripe from 'stripe'
import type { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { LucidModel } from '@adonisjs/lucid/types/model'
import type { Invoice } from './invoice.js'
import type { Payment } from './payment.js'
import type { PaymentMethod } from './payment_method.js'
import type { Checkout } from './checkout.js'
import type { Discount } from './discount.js'
import type { PromotionCode } from './promotion_code.js'
import type { CustomerBalanceTransaction } from './customer_balance_transaction.js'
import type { SubscriptionBuilder } from './subscription_builder.js'
import type Subscription from './models/subscription.js'

export interface ManagesStripeContract {
  stripeId: string | null

  hasStripeId(): boolean
  stripeIdOrFail(): string
  get stripe(): Stripe
}

export interface HandlesTaxesContract {
  customerIpAddress: string | null
  estimationBillingAddress: Partial<Stripe.Address>
  collectTaxIds: boolean

  withTaxIpAddress(ipAddress: string): void
  withTaxAddress(country: string, postalCode?: string, state?: string): void
  automaticTaxPayload(): { enabled: boolean }
  isAutomaticTaxEnabled(): boolean
  withTaxIdsCollect(): void
}

export interface ManagesCustomerContract extends ManagesStripeContract {
  createAsStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>
  updateStripeCustomer(params?: Stripe.CustomerUpdateParams): Promise<Stripe.Customer>
  createOrGetStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>
  updateOrCreateStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>
  syncOrCreateStripeCustomer(params?: Stripe.CustomerCreateParams): Promise<Stripe.Customer>
  asStripeCustomer(expand?: string[]): Promise<Stripe.Customer>
  stripeName(): string | undefined
  stripeEmail(): string | undefined
  stripePhone(): string | undefined
  stripeAddress(): Stripe.Emptyable<Stripe.AddressParam> | undefined
  stripePreferredLocales(): string[]
  stripeMetadata(): Record<string, string>
  syncStripeCustomerDetails(): Promise<Stripe.Customer>
  discount(): Promise<Discount | null>
  findPromotionCode(
    code: string,
    params?: Stripe.PromotionCodeListParams
  ): Promise<PromotionCode | null>
  findActivePromotionCode(
    code: string,
    params?: Stripe.PromotionCodeListParams
  ): Promise<PromotionCode | null>
  balance(): Promise<string>
  rawBalance(): Promise<number>
  balanceTransaction(
    limit?: number,
    params?: Stripe.CustomerListBalanceTransactionsParams
  ): Promise<CustomerBalanceTransaction[]>
  creditBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>
  debitBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>
  applyBalance(
    amount: number,
    description?: string,
    params?: Partial<Stripe.CustomerCreateBalanceTransactionParams>
  ): Promise<CustomerBalanceTransaction>
  preferredCurrency(): string
  formatAmount(amount: number): string
  billingPortalUrl(
    returnUrl?: string,
    params?: Stripe.BillingPortal.SessionCreateParams
  ): Promise<string>
  taxIds(params?: Stripe.CustomerListTaxIdsParams): Promise<Stripe.TaxId[]>
  findTaxId(id: string): Promise<Stripe.TaxId | null>
  createTaxId(type: Stripe.CustomerCreateTaxIdParams.Type, value: string): Promise<Stripe.TaxId>
  deleteTaxId(id: string): Promise<void>
  isNotTaxExempt(): Promise<boolean>
  isTaxExempt(): Promise<boolean>
  reverseChargeApplies(): Promise<boolean>
}

export interface ManagesPaymentMethodsContract extends ManagesCustomerContract {
  pmType: string | null
  pmLastFour: string | null

  createSetupIntent(params?: Stripe.SetupIntentCreateParams): Promise<Stripe.SetupIntent>
  findSetupIntent(
    id: string,
    params?: Stripe.SetupIntentRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<Stripe.SetupIntent>
  hasDefaultPaymentMethod(): boolean
  hasPaymentMethod(type?: string): Promise<boolean>
  paymentMethods(
    type?: Stripe.PaymentMethodListParams.Type,
    params?: Stripe.PaymentMethodListParams
  ): Promise<PaymentMethod[]>
  addPaymentMethod(paymentMethod: string | Stripe.PaymentMethod): Promise<PaymentMethod>
  deletePaymentMethod(paymentMethod: string | Stripe.PaymentMethod): Promise<void>
  defaultPaymentMethod(): Promise<PaymentMethod | Stripe.CustomerSource | null>
  updateDefaultPaymentMethod(paymentMethod: string | Stripe.PaymentMethod): Promise<PaymentMethod>
  updateDefaultPaymentMethodFromStripe(): Promise<void>
  deletePaymentMethods(type?: Stripe.PaymentMethodListParams.Type): Promise<void>
  findPaymentMethod(paymentMethod: string): Promise<PaymentMethod | null>
}

export interface ManagesInvoicesContract extends ManagesCustomerContract, HandlesTaxesContract {
  tab(
    description: string,
    amount?: number,
    params?: Record<string, unknown>
  ): Promise<Stripe.InvoiceItem>
  tabPrice(
    price: string,
    quantity?: number,
    params?: Partial<Stripe.InvoiceItemCreateParams>
  ): Promise<Stripe.InvoiceItem>
  invoiceFor(
    description: string,
    amount: number,
    tabParams?: Record<string, unknown>,
    invoiceParams?: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams
  ): Promise<Invoice>
  invoicePrice(
    price: string,
    quantity?: number,
    tabParams?: Partial<Stripe.InvoiceItemCreateParams>,
    invoiceParams?: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams
  ): Promise<Invoice>
  invoice(params?: Stripe.InvoiceCreateParams & Stripe.InvoicePayParams): Promise<Invoice>
  createInvoice(params?: Stripe.InvoiceCreateParams): Promise<Invoice>
  upcomingInvoice(params?: Stripe.InvoiceCreatePreviewParams): Promise<Invoice | null>
  findInvoice(id: string): Promise<Invoice | null>
  findInvoiceOrFail(id: string): Promise<Invoice>
  invoices(includePending?: boolean, params?: Stripe.InvoiceListParams): Promise<Invoice[]>
  invoicesIncludingPending(params?: Stripe.InvoiceListParams): Promise<Invoice[]>
}

export interface ManagesSubscriptionsContract {
  trialEndsAt: DateTime | null
  subscriptions: HasMany<typeof Subscription>

  /**
   * Begin creating a new subscription.
   */
  newSubscription(type: string, prices?: string | string[]): SubscriptionBuilder

  /**
   * Determine if the Stripe model is on trial.
   */
  onTrial(type?: string, price?: string): Promise<boolean>

  /**
   * Determine if the Stripe model's trial has ended.
   */
  hasExpiredTrial(type?: string, price?: string): Promise<boolean>

  /**
   * Determine if the Stripe model is on a "generic" trial at the model level.
   */
  onGenericTrial(): boolean

  /**
   * Determine if the Stripe model's "generic" trial at the model level has expired.
   */
  hasExpiredGenericTrial(): boolean

  /**
   * Get the ending date of the trial.
   */
  getTrialEndsAt(type?: string): Promise<DateTime | null>

  /**
   * Determine if the Stripe model has a given subscription.
   */
  subscribed(type?: string, price?: string): Promise<boolean>

  /**
   * Get a subscription instance by $type.
   */
  subscription(type?: string): Promise<Subscription | null>

  /**
   * Determine if the Stripe model is actively subscribed to one of the given products.
   */
  subscribedToProduct(products: string[], type: string): Promise<boolean>

  /**
   * Determine if the Stripe model is actively subscribed to one of the given prices.
   */
  subscribedToPrice(prices: string[], type: string): Promise<boolean>

  /**
   * Get the tax rates to apply to the subscription.
   */
  taxRates(): string[]

  /**
   * Get the tax rates to apply to individual subscription items.
   */
  priceTaxRates(): Record<string, string[]>

  /**
   * Apply a coupon to the customer's subscriptions.
   */
  applyCoupon(coupon: string, subscriptionTypes?: string | string[]): Promise<void>

  /**
   * Apply a promotion code to the customer's subscriptions.
   */
  applyPromotionCode(promotionCodeId: string, subscriptionTypes?: string | string[]): Promise<void>
}

export interface PerformsChargesContract extends ManagesCustomerContract {
  charge(
    amount: number,
    paymentMethod: string,
    params: Partial<Stripe.PaymentIntentCreateParams>
  ): Promise<Payment>
  pay(
    amount: number,
    params?: Partial<Omit<Stripe.PaymentIntentCreateParams, 'payment_method_types'>>
  ): Promise<Payment>
  payWith(
    amount: number,
    paymentMethods: string[],
    params?: Partial<Omit<Stripe.PaymentIntentCreateParams, 'automatic_payment_methods'>>
  ): Promise<Payment>
  createPayment(
    amount: number,
    params?: Partial<Stripe.PaymentIntentCreateParams>
  ): Promise<Payment>
  findPayment(id: string): Promise<Payment | null>
  refund(
    paymentIntent: string,
    params?: Omit<Stripe.RefundCreateParams, 'payment_intent'>
  ): Promise<Stripe.Refund>
  checkout(
    items:
      | Record<string, number>
      | string
      | string[]
      | Stripe.Checkout.SessionCreateParams.LineItem[],
    sessionParams?: Stripe.Checkout.SessionCreateParams,
    customerParams?: Stripe.CustomerCreateParams
  ): Promise<Checkout>
  checkoutCharge(
    amount: number,
    name: string,
    quantity?: number,
    sessionParams?: Stripe.Checkout.SessionCreateParams,
    customerParams?: Stripe.CustomerCreateParams
  ): Promise<Checkout>
}

export interface AllowsCouponContract {
  couponId?: string
  promotionCodeId?: string
  allowPromotionCodes: boolean

  withCoupon(couponId: string): this
  withPromotionCode(promotionCodeId: string): this
  withAllowPromotionsCodes(): this
  checkoutDiscounts(): Stripe.Checkout.SessionCreateParams.Discount[] | undefined
}

/**
 * Combined interface for a Billable model instance.
 * Used by wrapper classes (Invoice, Payment, Checkout, etc.) to reference
 * the owner without creating circular type dependencies.
 */
export interface BillableContract
  extends
    ManagesStripeContract,
    HandlesTaxesContract,
    ManagesCustomerContract,
    ManagesPaymentMethodsContract,
    ManagesInvoicesContract,
    ManagesSubscriptionsContract,
    PerformsChargesContract {}

export type BillableModel = LucidModel & { new (...args: any[]): BillableContract }
