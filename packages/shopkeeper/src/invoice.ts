import type Stripe from 'stripe'
import { type WithManagesInvoices } from './mixins/manages_invoices.js'
import { Tax } from './tax.js'
import { Discount } from './discount.js'
import { InvalidInvoiceError } from './errors/invalid_invoice.js'
import { DateTime, type Zone } from 'luxon'
import shopkeeper from '../services/shopkeeper.js'
import { InvoiceLineItem } from './invoice_line_item.js'

export class Invoice {
  /**
   * The Stripe model instance.
   */
  #owner: WithManagesInvoices['prototype']

  /**
   * The Stripe invoice instance.
   */
  #invoice: Stripe.Invoice | Stripe.UpcomingInvoice

  /**
   * The Stripe invoice line items.
   */
  #items?: InvoiceLineItem[]

  /**
   * The taxes applied to the invoice.
   */
  #taxes?: Tax[]

  /**
   * The discounts applied to the invoice.
   */
  #discounts?: Discount[]

  /**
   * Indicate if the Stripe Object was refreshed with extra data.
   */
  #refreshed = false

  constructor(
    owner: WithManagesInvoices['prototype'],
    invoice: Stripe.Invoice | Stripe.UpcomingInvoice
  ) {
    if (owner.stripeId !== invoice.customer) {
      throw InvalidInvoiceError.invalidOwner(invoice, owner)
    }

    this.#owner = owner
    this.#invoice = invoice
  }

  /**
   * Get a DateTime instance for the invoicing date.
   */
  date(timezone?: string | Zone<boolean>): DateTime {
    return DateTime.fromSeconds(this.#invoice.created, { zone: timezone })
  }

  /**
   * Get a DateTime instance for the invoice's due date.
   */
  dueDate(timezone?: string | Zone<boolean>): DateTime | null {
    if (this.#invoice.due_date) {
      return DateTime.fromSeconds(this.#invoice.created, { zone: timezone })
    }
    return null
  }

  /**
   * Get the total amount minus the starting balance that was paid (or will be paid).
   */
  total(): string {
    return this.formatAmount(this.rawTotal())
  }

  /**
   * Get the raw total amount minus the starting balance that was paid (or will be paid).
   */
  rawTotal(): number {
    return this.#invoice.total + this.rawStartingBalance()
  }

  /**
   * Get the total amount that was paid (or will be paid).
   */
  realTotal(): string {
    return this.formatAmount(this.rawRealTotal())
  }

  /**
   * Get the raw total amount that was paid (or will be paid).
   */
  rawRealTotal(): number {
    return this.#invoice.total
  }

  /**
   * Get the total of the invoice (before discounts).
   */
  subtotal(): string {
    return this.formatAmount(this.#invoice.subtotal)
  }

  /**
   * Get the amount due for the invoice.
   */
  amountDue(): string {
    return this.formatAmount(this.rawAmountDue())
  }

  /**
   * Get the raw amount due for the invoice.
   */
  rawAmountDue(): number {
    return this.#invoice.amount_due ?? 0
  }

  /**
   * Determine if the account had a starting balance.
   */
  hasStartingBalance(): boolean {
    return this.rawStartingBalance() < 0
  }

  /**
   * Get the starting balance for the invoice.
   */
  startingBalance(): string {
    return this.formatAmount(this.rawStartingBalance())
  }

  /**
   * Get the raw starting balance for the invoice.
   */
  rawStartingBalance(): number {
    return this.#invoice.starting_balance ?? 0
  }

  /**
   * Determine if the account had an ending balance.
   */
  hasEndingBalance(): boolean {
    return !!this.#invoice.ending_balance
  }

  /**
   * Get the ending balance for the invoice.
   */
  endingBalance(): string {
    return this.formatAmount(this.rawEndingBalance())
  }

  /**
   * Get the raw ending balance for the invoice.
   */
  rawEndingBalance(): number {
    return this.#invoice.ending_balance ?? 0
  }

  /**
   * Determine if the invoice has balance applied.
   */
  hasAppliedBalance(): boolean {
    return this.rawAppliedBalance() < 0
  }

  /**
   * Get the applied balance for the invoice.
   */
  appliedBalance(): string {
    return this.formatAmount(this.rawAppliedBalance())
  }

  /**
   * Get the raw applied balance for the invoice.
   */
  rawAppliedBalance(): number {
    return this.rawStartingBalance() - this.rawEndingBalance()
  }

  /**
   * Determine if the invoice has one or more discounts applied.
   */
  hasDiscount(): boolean {
    return this.#invoice.discounts.length > 0
  }

  /**
   * Get all of the discount objects from the Stripe invoice.
   */
  async discounts(): Promise<Discount[]> {
    if (this.#discounts) {
      return this.#discounts
    }

    await this.refreshWithExpandedData()

    return this.#invoice.discounts.map((discount) => new Discount(discount as Stripe.Discount))
  }

  /**
   * Calculate the amount for a given discount.
   */
  discountFor(discount: Discount): string | null {
    const amount = this.rawDiscountFor(discount)
    return amount ? this.formatAmount(amount) : null
  }

  /**
   * Calculate the raw amount for a given discount.
   */
  rawDiscountFor(discount: Discount): number | null {
    const discounts = this.#invoice.total_discount_amounts ?? []

    return (
      discounts.find((amount) =>
        typeof amount.discount === 'string'
          ? amount.discount === discount.asStripeDiscount().id
          : amount.discount.id === discount.asStripeDiscount().id
      )?.amount ?? null
    )
  }

  /**
   * Get the total discount amount.
   */
  discount(): string {
    return this.formatAmount(this.rawDiscount())
  }

  /**
   * Get the raw total discount amount.
   */
  rawDiscount(): number {
    let total = 0
    for (const discount of this.#invoice.total_discount_amounts ?? []) {
      total += discount.amount
    }
    return total
  }

  /**
   * Get the total tax amount.
   */
  tax(): string {
    return this.formatAmount(this.#invoice.tax ?? 0)
  }

  /**
   * Determine if the invoice has tax applied.
   */
  async hasTax(): Promise<boolean> {
    const lines = await Promise.all([this.invoiceItems(), this.subscriptions()]).then((p) =>
      p.flat()
    )

    return lines.some((l) => l.hasTaxRates())
  }

  /**
   * Get the taxes applied to the invoice.
   */
  async taxes() {
    if (this.#taxes) {
      return this.#taxes
    }

    await this.refreshWithExpandedData()

    this.#taxes = this.#invoice.total_tax_amounts.map(
      (taxAmount) =>
        new Tax(taxAmount.amount, this.#invoice.currency, taxAmount.tax_rate as Stripe.TaxRate)
    )

    return this.#taxes
  }

  /**
   * Determine if the customer is not exempted from taxes.
   */
  isNotTaxExempt(): boolean {
    return this.#invoice.customer_tax_exempt === 'none'
  }

  /**
   * Determine if the customer is exempted from taxes.
   */
  isTaxExempt(): boolean {
    return this.#invoice.customer_tax_exempt === 'exempt'
  }

  /**
   * Determine if reverse charge applies to the customer.
   */
  reverseChargesApplies(): boolean {
    return this.#invoice.customer_tax_exempt === 'reverse'
  }

  /**
   * Determine if the invoice will charge the customer automatically.
   */
  chargesAutomatically(): boolean {
    return this.#invoice.collection_method === 'charge_automatically'
  }

  /**
   * Determine if the invoice will send an invoice to the customer.
   */
  sendsInvoice(): boolean {
    return this.#invoice.collection_method === 'send_invoice'
  }

  /**
   * Get all of the "invoice item" line items.
   */
  async invoiceItems(): Promise<InvoiceLineItem[]> {
    const lines = await this.invoiceLineItems()
    return lines.filter((l) => l.type === 'invoiceitem')
  }

  /**
   * Get all of the "subscription" line items.
   */
  async subscriptions(): Promise<InvoiceLineItem[]> {
    const lines = await this.invoiceLineItems()
    return lines.filter((l) => l.type === 'subscription')
  }

  /**
   * Get all of the invoice items.
   */
  async invoiceLineItems(): Promise<InvoiceLineItem[]> {
    if (this.#items) {
      return this.#items
    }

    await this.refreshWithExpandedData()

    const items = []
    const lines =
      'id' in this.#invoice
        ? this.#owner.stripe.invoices.listLineItems(this.#invoice.id)
        : this.#owner.stripe.invoices.listUpcomingLines()

    for await (const line of lines) {
      items.push(new InvoiceLineItem(this, line))
    }

    return items
  }

  /**
   * Add an invoice item to this invoice.
   */
  async tab(
    description: string,
    amount: number,
    params: Partial<Stripe.InvoiceItemCreateParams> = {}
  ): Promise<Stripe.InvoiceItem> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: Handle that
    }

    const item = await this.#owner.tab(description, amount, {
      invoice: this.#invoice.id,
      ...params,
    })

    await this.refresh()
    return item
  }

  /**
   * Add an invoice item for a specific Price ID to this invoice.
   */
  async tabPrice(
    price: string,
    quantity = 1,
    params: Partial<Stripe.InvoiceItemCreateParams>
  ): Promise<Stripe.InvoiceItem> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: Handle that
    }

    const item = this.#owner.tabPrice(price, quantity, { invoice: this.#invoice.id, ...params })
    await this.refresh()
    return item
  }

  /**
   * Refresh the invoice.
   */
  async refresh(): Promise<void> {
    this.#invoice =
      'id' in this.#invoice
        ? await this.#owner.stripe.invoices.retrieve(this.#invoice.id)
        : await this.#owner.stripe.invoices.retrieveUpcoming()
  }

  /**
   * Refresh the invoice with expanded objects.
   */
  async refreshWithExpandedData(): Promise<void> {
    if (this.#refreshed) {
      return
    }

    const expand = [
      'account_tax_ids',
      'discounts',
      'lines.data.tax_amounts.tax_rate',
      'total_discount_amounts.discount',
      'total_tax_amounts.tax_rate',
    ]

    if ('id' in this.#invoice) {
      this.#invoice = await this.#owner.stripe.invoices.retrieve(this.#invoice.id, {
        expand,
      })
    } else {
      this.#invoice = await this.#owner.stripe.invoices.retrieveUpcoming({ expand })
    }

    this.#refreshed = true
  }

  /**
   * Format the given amount into a displayable currency.
   */
  formatAmount(amount: number): string {
    return shopkeeper.formatAmount(amount, this.#invoice.currency)
  }

  /**
   * Return the Tax Ids of the account.
   */
  accountTaxIds(): (Stripe.TaxId | Stripe.DeletedTaxId | string)[] {
    return this.#invoice.account_tax_ids ?? []
  }

  /**
   * Return the Tax Ids of the customer.
   */
  customerTaxIds(): Stripe.Invoice.CustomerTaxId[] {
    return this.#invoice.customer_tax_ids ?? []
  }

  /**
   * Finalize the Stripe invoice.
   */
  async finalize(params: Stripe.InvoiceFinalizeInvoiceParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    this.#invoice = await this.#owner.stripe.invoices.finalizeInvoice(this.#invoice.id, params)
  }

  /**
   * Pay the Stripe invoice.
   */
  async pay(params: Stripe.InvoicePayParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    this.#invoice = await this.#owner.stripe.invoices.pay(this.#invoice.id, params)
  }

  /**
   * Send the Stripe invoice to the customer.
   */
  async send(params: Stripe.InvoiceSendInvoiceParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    this.#invoice = await this.#owner.stripe.invoices.sendInvoice(this.#invoice.id, params)
  }

  /**
   * Void the Stripe invoice.
   */
  async void(params: Stripe.InvoiceVoidInvoiceParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    this.#invoice = await this.#owner.stripe.invoices.voidInvoice(this.#invoice.id, params)
  }

  /**
   * Mark an invoice as uncollectible.
   */
  async markUncollectible(params: Stripe.InvoiceMarkUncollectibleParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    this.#invoice = await this.#owner.stripe.invoices.markUncollectible(this.#invoice.id, params)
  }

  /**
   * Delete the Stripe invoice.
   */
  async delete(params: Stripe.InvoiceDeleteParams = {}): Promise<void> {
    if (!('id' in this.#invoice)) {
      throw new Error() // TODO: ERror
    }

    await this.#owner.stripe.invoices.del(this.#invoice.id, params)
  }

  /**
   * Determine if the invoice is open.
   */
  isOpen(): boolean {
    return this.#invoice.status === 'open'
  }

  /**
   * Determine if the invoice is draft.
   */
  isDraft(): boolean {
    return this.#invoice.status === 'draft'
  }

  /**
   * Determine if the invoice is paid.
   */
  isPaid(): boolean {
    return this.#invoice.status === 'paid'
  }

  /**
   * Determine if the invoice is uncollectible.
   */
  isUncollectible(): boolean {
    return this.#invoice.status === 'uncollectible'
  }

  /**
   * Determine if the invoice is void.
   */
  isVoid(): boolean {
    return this.#invoice.status === 'void'
  }

  /**
   * Get the Stripe model instance.
   */
  owner(): WithManagesInvoices['prototype'] {
    return this.#owner
  }

  /**
   * Get the Stripe invoice instance.
   */
  asStripeInvoice(): Stripe.Invoice | Stripe.UpcomingInvoice {
    return this.#invoice
  }
}
