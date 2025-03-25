import { ApplicationService } from '@adonisjs/core/types';
import { Shopkeeper } from '../src/shopkeeper.js';
import { ShopkeeperConfig } from '../src/types.js';
import { handleCustomerSubscriptionCreated } from '../src/handlers/handle_customer_subscription_created.js';
import { handleCustomerSubscriptionUpdated } from '../src/handlers/handle_customer_subscription_updated.js';
import { handleCustomerSubscriptionDeleted } from '../src/handlers/handle_customer_subscription_deleted.js';
import { handleWebhook } from '../src/handlers/handle_webhooks.js';
import { InvalidConfigurationError } from '../src/errors/invalid_configuration.js';
import BodyParserMiddleware from '@adonisjs/core/bodyparser_middleware';
import { defineConfig } from '@adonisjs/core/bodyparser';

export default class ShopkeeperProvider {
  #config: Required<ShopkeeperConfig>;

  constructor(protected app: ApplicationService) {
    this.#config = this.app.config.get<Required<ShopkeeperConfig>>('shopkeeper');
  }

  register() {
    this.app.container.singleton(Shopkeeper, async () => {
      const [customerModel, subscriptionModel, subscriptionItemModel] = await Promise.all([
        this.#config.models.customerModel().then((i) => i.default),
        this.#config.models.subscriptionModel().then((i) => i.default),
        this.#config.models.subscriptionItemModel().then((i) => i.default)
      ]);

      return new Shopkeeper(this.#config, customerModel, subscriptionModel, subscriptionItemModel);
    });
  }

  async boot() {
    await this.registerRoutes();
    await this.registerWebhookListeners();
  }

  async registerRoutes() {
    if (this.#config.registerRoutes) {
      const router = await this.app.container.make('router');

      const bodyParserConfig = this.app.config.get('bodyparser', null);
      const middleware = new BodyParserMiddleware(defineConfig({
        allowedMethods: ['POST'],
        json: {
          encoding: 'utf-8',
          convertEmptyStringsToNull: true,
          types: [
            'application/json',
            'application/json-patch+json',
            'application/vnd.api+json',
            'application/csp-report'
          ]
        }
      }));

      const route = router
        .post('/stripe/webhook', (ctx) => handleWebhook(ctx))
        .as('shopkeeper.webhook');

      if (!bodyParserConfig) {
        route.use((ctx, next) => middleware.handle(ctx, next));
      }

      if (this.#config.webhook.secret) {
        const middlewares = router.named({
          stripeWebhook: () => import('../src/middlewares/stripe_webhook_middleware.js')
        });

        route.middleware(middlewares.stripeWebhook());
      } else if (this.app.inProduction) {
        throw InvalidConfigurationError.webhookSecretInProduction();
      }
    }
  }

  async registerWebhookListeners() {
    const emitter = await this.app.container.make('emitter');
    emitter.on('stripe:customer.subscription.created', handleCustomerSubscriptionCreated);
    emitter.on('stripe:customer.subscription.updated', handleCustomerSubscriptionUpdated);
    emitter.on('stripe:customer.subscription.deleted', handleCustomerSubscriptionDeleted);
  }
}
