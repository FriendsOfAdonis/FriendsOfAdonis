import { adapters, defineConfig } from '@foadonis/flow'

export default defineConfig({
  logger: 'worker',
  adapter: adapters.memory(),
  // adapter: adapters.bullmq({
  //   connection: {
  //     maxRetriesPerRequest: null,
  //   },
  // }),
})
