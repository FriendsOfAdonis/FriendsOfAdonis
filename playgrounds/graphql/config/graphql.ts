import { defineConfig, drivers } from '@foadonis/graphql'
import { type InferSubscriptionDriver } from '@foadonis/graphql/types'

const graphqlConfig = defineConfig({
  /**
   * Path to the GraphQL endpoint.
   */
  path: '/graphql',

  /**
   * GraphQL server driver (Apollo or Yoga).
   */
  driver: drivers.apollo({
    playground: true,
    introspection: true,
  }),

  /**
   * Logger name used by the GraphQL server.
   *
   * @see {@link https://docs.adonisjs.com/guides/digging-deeper/logger#using-multiple-loggers}
   */
  logger: 'app',

  /**
   * PubSub instance used for subscriptions.
   */
  pubSub: drivers.pubsub.native(),

  subscription: drivers.subscription.websocket({
    path: '/graphql',
  }),

  /**
   * Automatically emit the `graphql.schema` file.
   */
  emitSchemaFile: true,
})

export default graphqlConfig

declare module '@foadonis/graphql/types' {
  export interface GraphQLDriver extends InferGraphQLDriver<typeof graphqlConfig> {}
  export interface PubSubDriver extends InferPubSubDriver<typeof graphqlConfig> {}
  export interface SubscriptionDriver extends InferSubscriptionDriver<typeof graphqlConfig> {}
}
