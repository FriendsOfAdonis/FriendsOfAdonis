import Stripe from 'stripe'
import type { HttpRouterService } from '@adonisjs/core/types'
import type { Route } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { ShopkeeperConfig } from './types.js'
import { WithBillable } from './mixins/billable.js'
import { NormalizeConstructor } from '@poppinss/utils/types'
import Subscription from './models/subscription.js'
import SubscriptionItem from './models/subscription_item.js'
import { handleWebhook } from '../src/handlers/handle_webhooks.js'
import { InvalidConfigurationError } from '../src/errors/invalid_configuration.js'

export class Shopkeeper {
  readonly #config: ShopkeeperConfig
  readonly #router: HttpRouterService
  readonly #stripe: Stripe
  #customerModel: WithBillable
  #subscriptionModel: NormalizeConstructor<typeof Subscription>
  #subscriptionItemModel: NormalizeConstructor<typeof SubscriptionItem>

  constructor(
    config: ShopkeeperConfig,
    router: HttpRouterService,
    customerModel: WithBillable,
    subscriptionModel: NormalizeConstructor<typeof Subscription>,
    subscriptionItemModel: NormalizeConstructor<typeof SubscriptionItem>
  ) {
    this.#config = config
    this.#router = router
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

  public registerRoutes(routeHandlerModifier?: (route: Route) => void) {
    const webhookRoute = this.#router
      .post('/stripe/webhook', (ctx) => handleWebhook(ctx))
      .as('shopkeeper.webhook')

    if (this.#config.webhook.secret) {
      const middlewares = this.#router.named({
        stripeWebhook: () => import('../src/middlewares/stripe_webhook_middleware.js'),
      })

      webhookRoute.middleware(middlewares.stripeWebhook())
    } else if (app.inProduction) {
      throw InvalidConfigurationError.webhookSecretInProduction()
    }

    if (routeHandlerModifier) {
      routeHandlerModifier(webhookRoute)
    }
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
