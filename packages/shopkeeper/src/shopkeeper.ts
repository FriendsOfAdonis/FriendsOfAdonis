import Stripe from 'stripe'
import { type ShopkeeperConfig } from './types.js'
import { type WithBillable } from './mixins/billable.js'
import { type NormalizeConstructor } from '@poppinss/utils/types'
import type Subscription from './models/subscription.js'
import type SubscriptionItem from './models/subscription_item.js'

export class Shopkeeper {
  readonly #config: ShopkeeperConfig
  readonly #stripe: Stripe
  #customerModel: WithBillable
  #subscriptionModel: NormalizeConstructor<typeof Subscription>
  #subscriptionItemModel: NormalizeConstructor<typeof SubscriptionItem>

  constructor(
    config: ShopkeeperConfig,
    customerModel: WithBillable,
    subscriptionModel: NormalizeConstructor<typeof Subscription>,
    subscriptionItemModel: NormalizeConstructor<typeof SubscriptionItem>
  ) {
    this.#config = config
    this.#customerModel = customerModel
    this.#subscriptionModel = subscriptionModel
    this.#subscriptionItemModel = subscriptionItemModel

    this.#stripe = new Stripe(config.secret, config.stripe)
  }

  public get stripe(): Stripe {
    return this.#stripe
  }

  public get config(): ShopkeeperConfig {
    return this.#config
  }

  /**
   * Format the given amount into a displayable currency.
   */
  public formatAmount(amount: number, currency?: string): string {
    return Intl.NumberFormat(this.config.currencyLocale, { style: 'currency', currency }).format(
      amount / 100
    )
  }

  /**
   * Get the customer instance by its Stripe ID.
   */
  public async findBillable(
    customer: Stripe.Customer | Stripe.DeletedCustomer | string
  ): Promise<WithBillable['prototype'] | null> {
    const stripeId = typeof customer === 'string' ? customer : customer.id

    const billable = await this.customerModel.findBy({
      stripeId,
    })

    return billable
  }

  public get customerModel(): WithBillable {
    return this.#customerModel
  }

  public get subscriptionModel(): NormalizeConstructor<typeof Subscription> {
    return this.#subscriptionModel
  }

  public get subscriptionItemModel(): NormalizeConstructor<typeof SubscriptionItem> {
    return this.#subscriptionItemModel
  }

  public get calculateTaxes(): boolean {
    return this.config.calculateTaxes
  }

  public get currency(): string {
    return this.#config.currency
  }
}
