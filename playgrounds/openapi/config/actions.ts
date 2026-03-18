import { defineConfig, middlewares } from '@foadonis/actions'

export default defineConfig({
  middlewares: {
    asCommand: [middlewares.asListener.scopedLogger],
    asController: [middlewares.asController.scopedLogger],
    asListener: [middlewares.asListener.scopedLogger],
    asJob: [middlewares.asJob.scopedLogger],
  },
})
