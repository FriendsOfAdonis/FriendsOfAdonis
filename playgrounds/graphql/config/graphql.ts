import { defineConfig, drivers, pubsubs } from '@foadonis/graphql'

export default defineConfig({
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
  pubSub: pubsubs.native(),

  /**
   * Automatically emit the `graphql.schema` file.
   */
  emitSchemaFile: true,
})
