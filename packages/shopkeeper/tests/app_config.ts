import { defineConfig as defineDatabaseConfig } from '@adonisjs/lucid'
import { defineConfig } from '../src/define_config.js'
import { WEBHOOK_EVENTS } from '../src/constants.js'

export default {
  rcFileContents: {
    providers: [
      () => import('@adonisjs/lucid/database_provider'),
      () => import('../providers/shopkeeper_provider.js'),
    ],
    commands: [() => import('@adonisjs/lucid/commands')],
  },
  config: {
    shopkeeper: defineConfig({
      key: 'random',
      secret: process.env.STRIPE_SECRET as string,

      currency: 'EUR',
      currencyLocale: 'fr-FR',

      webhook: {
        tolerance: 300,
        events: WEBHOOK_EVENTS,
      },

      models: {
        customerModel: () => import('./fixtures/user.js'),
        subscriptionModel: () => import('../src/models/subscription.js'),
        subscriptionItemModel: () => import('../src/models/subscription_item.js'),
      },

      calculateTaxes: false,

      keepIncompleteSubscriptionsActive: false,
      keepPastDueSubscriptionsActive: false,
    }),
    database: defineDatabaseConfig({
      connection: 'sqlite',
      connections: {
        sqlite: {
          client: 'sqlite',
          connection: {
            filename: 'tests/tmp/db.sqlite',
          },
          useNullAsDefault: true,
          migrations: {
            paths: ['database/migrations'],
          },
        },
      },
    }),
  },
}
