import type Stripe from 'stripe'
import { Invoice } from '../invoice.js'
import { Payment } from '../payment.js'
import { checkStripeError } from '../utils/errors.js'
import type { Shopkeeper } from '../shopkeeper.js'
import type { ManagesInvoicesContract } from '../contracts.js'

//#region Types
type LineItem = Stripe.InvoiceAddLinesParams.Line

type TabItem = {
  type: 'tab'
  description: string
  amount: number
  params: Partial<
    Omit<LineItem, 'price_data'> & {
      price_data?: Omit<NonNullable<LineItem['price_data']>, 'currency'> & {
        currency?: string
      }
    }
  >
}

type PriceItem = {
  type: 'price'
  price: string
  quantity: number
  params: Partial<LineItem>
}

type InvoiceItem = TabItem | PriceItem

//#endregion

export class InvoiceBuilder implements PromiseLike<Invoice> {
  #items: InvoiceItem[] = []
  #invoiceParams: Stripe.InvoiceCreateParams = {}
  #isDraft = true
  #payParams: Stripe.InvoicePayParams = {}

  constructor(
    private shopkeeper: Shopkeeper,
    private owner: ManagesInvoicesContract
  ) {}

  /**
   * Add a custom amount item to the invoice.
   */
  addItem(description: string, amount: number = 1, params: TabItem['params'] = {}): this {
    this.#items.push({ type: 'tab', description, amount, params })
    return this
  }

  /**
   * Add a price-based item to the invoice.
   */
  addPrice(price: string, quantity = 1, params: Partial<LineItem> = {}): this {
    this.#items.push({ type: 'price', price, quantity, params })
    return this
  }

  /**
   * Set the number of days until the invoice is due.
   */
  daysUntilDue(days: number): this {
    this.#invoiceParams.days_until_due = days
    return this
  }

  /**
   * Set the description for the invoice.
   */
  description(description: string): this {
    this.#invoiceParams.description = description
    return this
  }

  /**
   * Set metadata on the invoice.
   */
  withMetadata(metadata: Record<string, string>): this {
    this.#invoiceParams.metadata = { ...this.#invoiceParams.metadata, ...metadata }
    return this
  }

  /**
   * Set the currency for the invoice.
   */
  currency(currency: string): this {
    this.#invoiceParams.currency = currency
    return this
  }

  /**
   * Set raw Stripe invoice creation parameters.
   */
  invoiceParams(params: Stripe.InvoiceCreateParams): this {
    this.#invoiceParams = { ...this.#invoiceParams, ...params }
    return this
  }

  /**
   * Set raw Stripe invoice pay parameters.
   */
  paymentParams(params: Stripe.InvoicePayParams): this {
    this.#payParams = { ...this.#payParams, ...params }
    return this
  }

  /**
   * Mark the invoice to be paid automatically upon creation.
   */
  charge(params: Stripe.InvoicePayParams = {}): this {
    this.#isDraft = false
    this.#invoiceParams.collection_method = 'charge_automatically'
    this.#payParams = { ...this.#payParams, ...params }
    return this
  }

  /**
   * Mark the invoice to be sent to the customer.
   */
  send(): this {
    this.#isDraft = false
    this.#invoiceParams.collection_method = 'send_invoice'
    return this
  }

  /**
   * Keep the invoice as a draft (do not finalize).
   */
  draft(): this {
    this.#isDraft = true
    return this
  }

  /**
   * Create the invoice with all accumulated items.
   */
  async create(): Promise<Invoice> {
    const stripeId = this.owner.stripeIdOrFail()
    const stripe = this.shopkeeper.stripe
    const currency = this.owner.preferredCurrency()

    const stripeInvoice = await stripe.invoices.create({
      automatic_tax: this.owner.automaticTaxPayload(),
      customer: stripeId,
      currency,
      ...this.#invoiceParams,
    })

    if (this.#items.length > 0) {
      const lines: Stripe.InvoiceAddLinesParams.Line[] = this.#items.map((item) => {
        if (item.type === 'tab') {
          return this.#buildTabLine(item, currency)
        }
        const { price, quantity, params } = item
        return { pricing: { price }, quantity, ...params }
      })

      await stripe.invoices.addLines(stripeInvoice.id, { lines })
    }

    const invoice = new Invoice(this.owner, stripeInvoice)
    await invoice.refresh()

    return this.#finalize(invoice)
  }

  /**
   * PromiseLike implementation — resolves by calling create().
   */
  then<TResult1 = Invoice, TResult2 = never>(
    onfulfilled?: ((value: Invoice) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.create().then(onfulfilled, onrejected)
  }

  #buildTabLine(item: TabItem, currency: string): Stripe.InvoiceAddLinesParams.Line {
    const { price_data: priceData, quantity, ...restParams } = item.params

    const productRef = priceData?.product
      ? { product: priceData.product }
      : { product_data: priceData?.product_data ?? { name: item.description } }

    return {
      description: item.description,
      quantity: quantity ?? 1,
      price_data: {
        ...productRef,
        ...priceData,
        unit_amount: item.amount,
        currency,
      },
      ...restParams,
    }
  }

  async #finalize(invoice: Invoice): Promise<Invoice> {
    if (this.#isDraft) {
      return invoice
    }

    try {
      if (invoice.chargesAutomatically()) {
        await invoice.pay(this.#payParams)
      } else {
        await invoice.send()
      }
    } catch (e) {
      const err = checkStripeError(e, 'StripeCardError')
      await invoice.refresh()

      if (err.payment_intent) {
        new Payment(err.payment_intent).validate()
      }
    }

    return invoice
  }
}
