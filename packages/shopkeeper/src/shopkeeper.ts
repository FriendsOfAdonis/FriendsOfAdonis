import Stripe from 'stripe'
import { type ResolvedConfig } from './types.ts'
import { type BillableModel } from './contracts.ts'
import { type NormalizeConstructor } from '@poppinss/utils/types'
import type Subscription from './models/subscription.js'
import type SubscriptionItem from './models/subscription_item.ts'
import { type EmitterService, type HttpRouterService } from '@adonisjs/core/types'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import WebhookEvent from './models/webhook_event.js'

const CustomerSubscriptionCreatedListener = () =>
  import('./handlers/customer_subscription_created_listener.ts')
const CustomerSubscriptionDeletedListener = () =>
  import('./handlers/customer_subscription_deleted_listener.ts')
const CustomerSubscriptionUpdatedListener = () =>
  import('./handlers/customer_subscription_updated_listener.ts')
const ShopkeeperWebhookController = () => import('./controllers/shopkeeper_webhook_controller.ts')

export class Shopkeeper {
  /**
   * @internal
   */
  static $instance: Shopkeeper

  #config: ResolvedConfig
  #stripe: Stripe
  #router: HttpRouterService
  #emitter: EmitterService

  constructor(config: ResolvedConfig, router: HttpRouterService, emitter: EmitterService) {
    this.#config = config
    this.#stripe = new Stripe(config.secret.release(), config.stripe)
    this.#router = router
    this.#emitter = emitter

    Shopkeeper.$instance = this
  }

  public get stripe(): Stripe {
    return this.#stripe
  }

  public get config(): ResolvedConfig {
    return this.#config
  }

  public get customerModel(): BillableModel {
    return this.config.models.customerModel
  }

  public get subscriptionModel(): NormalizeConstructor<typeof Subscription> {
    return this.config.models.subscriptionModel
  }

  public get subscriptionItemModel(): NormalizeConstructor<typeof SubscriptionItem> {
    return this.config.models.subscriptionItemModel
  }

  public get calculateTaxes(): boolean {
    return this.config.calculateTaxes
  }

  public get currency(): string {
    return this.#config.currency
  }

  /**
   * Get the customer instance by its Stripe ID.
   */
  public async findBillable(
    customer: Stripe.Customer | Stripe.DeletedCustomer | string
  ): Promise<InstanceType<BillableModel> | null> {
    const stripeId = typeof customer === 'string' ? customer : customer.id

    const billable = await this.customerModel.findBy({
      stripeId,
    })

    return billable
  }

  /**
   * Format the given amount into a displayable currency.
   */
  public formatAmount(amount: number, currency?: string): string {
    const locale = this.#config.currencyLocale
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount / 100)
  }

  public registerRoutes() {
    const middlewares = this.#router.named({
      stripeWebhook: () => import('./middlewares/stripe_webhook_middleware.ts'),
    })

    return this.#router
      .post('/stripe/webhook', [ShopkeeperWebhookController, 'handle'])
      .use(middlewares.stripeWebhook())
      .as('shopkeeper.webhook')
  }

  /**
   * Wrap webhook handling with idempotency audit.
   * The event is recorded in `stripe_webhook_events` within the same transaction.
   * If the callback throws, the transaction rolls back and the event is not marked as processed.
   */
  public async webhookAudit(
    event: Stripe.Event,
    callback: (trx: TransactionClientContract) => Promise<void>
  ): Promise<boolean> {
    const alreadyProcessed = await WebhookEvent.findBy('eventId', event.id)

    if (alreadyProcessed) {
      return false
    }

    const { default: db } = await import('@adonisjs/lucid/services/db')

    await db.transaction(async (trx) => {
      await callback(trx)

      await WebhookEvent.create(
        {
          eventId: event.id,
          eventPayload: event as unknown as Record<string, unknown>,
        },
        { client: trx }
      )
    })
    return true
  }

  public registerWebhookListeners() {
    this.#emitter.on('stripe:customer.subscription.created', [
      CustomerSubscriptionCreatedListener,
      'handle',
    ])
    this.#emitter.on('stripe:customer.subscription.deleted', [
      CustomerSubscriptionDeletedListener,
      'handle',
    ])
    this.#emitter.on('stripe:customer.subscription.updated', [
      CustomerSubscriptionUpdatedListener,
      'handle',
    ])
  }
}
