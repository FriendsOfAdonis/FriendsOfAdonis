import pubsub from '#graphql/pubsub'
import env from '#start/env'
import { defineConfig } from '@foadonis/graphql'

const isProduction = env.get('NODE_ENV') === 'production'

export default defineConfig({
  path: '/graphql',
  apollo: {
    introspection: !isProduction,
    playground: !isProduction,
  },
  emitSchemaFile: true,
  pubSub: pubsub.notification,
})
