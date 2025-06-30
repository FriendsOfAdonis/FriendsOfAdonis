import { ApplicationService } from '@adonisjs/core/types'
import { Shopkeeper } from '../src/shopkeeper.js'
import { ShopkeeperConfig } from '../src/types.js'
import { handleCustomerSubscriptionCreated } from '../src/handlers/handle_customer_subscription_created.js'
import { handleCustomerSubscriptionUpdated } from '../src/handlers/handle_customer_subscription_updated.js'
import { handleCustomerSubscriptionDeleted } from '../src/handlers/handle_customer_subscription_deleted.js'

export default class ShopkeeperProvider {
  #config: Required<ShopkeeperConfig>

  constructor(protected app: ApplicationService) {
    this.#config = this.app.config.get<Required<ShopkeeperConfig>>('shopkeeper')
  }

  register() {
    this.app.container.singleton(Shopkeeper, async () => {
      const router = await this.app.container.make('router')

      const [customerModel, subscriptionModel, subscriptionItemModel] = await Promise.all([
        this.#config.models.customerModel().then((i) => i.default),
        this.#config.models.subscriptionModel().then((i) => i.default),
        this.#config.models.subscriptionItemModel().then((i) => i.default),
      ])

      return new Shopkeeper(
        this.#config,
        router,
        customerModel,
        subscriptionModel,
        subscriptionItemModel
      )
    })
  }

  async boot() {
    await this.registerWebhookListeners()
  }

  async registerWebhookListeners() {
    const emitter = await this.app.container.make('emitter')
    emitter.on('stripe:customer.subscription.created', handleCustomerSubscriptionCreated)
    emitter.on('stripe:customer.subscription.updated', handleCustomerSubscriptionUpdated)
    emitter.on('stripe:customer.subscription.deleted', handleCustomerSubscriptionDeleted)
  }
}
