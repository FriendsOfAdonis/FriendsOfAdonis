import pubsub from '#graphql/pubsub'
import { defineConfig, drivers } from '@foadonis/graphql'

export default defineConfig({
  driver: drivers.yoga({}),
  logger: 'app',
  path: '/graphql',
  emitSchemaFile: true,
  pubSub: pubsub.notification,
})
