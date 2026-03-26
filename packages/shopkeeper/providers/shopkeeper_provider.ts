import { type ApplicationService } from '@adonisjs/core/types'
import { Shopkeeper } from '../src/shopkeeper.js'
import { type ShopkeeperConfig } from '../src/types.js'
import { handleCustomerSubscriptionCreated } from '../src/handlers/handle_customer_subscription_created.js'
import { handleCustomerSubscriptionUpdated } from '../src/handlers/handle_customer_subscription_updated.js'
import { handleCustomerSubscriptionDeleted } from '../src/handlers/handle_customer_subscription_deleted.js'
import { handleWebhook } from '../src/handlers/handle_webhooks.js'
import { InvalidConfigurationError } from '../src/errors/invalid_configuration.js'
import { Coupon } from '../src/coupon.js'

export default class Shop2keeperProvider {
  #config: Required<ShopkeeperConfig>

  constructor(protected app: ApplicationService) {
    this.#config = this.app.config.get<Required<ShopkeeperConfig>>('shopkeeper')
  }

  register() {
    this.app.container.singleton(Shopkeeper, async () => {
      const [customerModel, subscriptionModel, subscriptionItemModel] = await Promise.all([
        this.#config.models.customerModel().then((i) => i.default),
        this.#config.models.subscriptionModel().then((i) => i.default),
        this.#config.models.subscriptionItemModel().then((i) => i.default),
      ])

      return new Shopkeeper(this.#config, customerModel, subscriptionModel, subscriptionItemModel)
    })
    this.app.container.alias('shopkeeper', Shopkeeper)
  }

  async boot() {
    await this.registerRoutes()
    await this.registerWebhookListeners()

    const shopkeeper = await this.app.container.make(Shopkeeper)
    Coupon.useShopkeeper(shopkeeper)
  }

  async registerRoutes() {
    if (this.#config.registerRoutes) {
      const router = await this.app.container.make('router')

      const route = router
        .post('/stripe/webhook', (ctx) => handleWebhook(ctx))
        .as('shopkeeper.webhook')

      if (this.#config.webhook.secret) {
        const middlewares = router.named({
          stripeWebhook: () => import('../src/middlewares/stripe_webhook_middleware.js'),
        })

        route.middleware(middlewares.stripeWebhook())
      } else if (this.app.inProduction) {
        throw InvalidConfigurationError.webhookSecretInProduction()
      }
    }
  }

  async registerWebhookListeners() {
    const emitter = await this.app.container.make('emitter')
    emitter.on('stripe:customer.subscription.created', handleCustomerSubscriptionCreated)
    emitter.on('stripe:customer.subscription.updated', handleCustomerSubscriptionUpdated)
    emitter.on('stripe:customer.subscription.deleted', handleCustomerSubscriptionDeleted)
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    shopkeeper: Shopkeeper
  }
}
