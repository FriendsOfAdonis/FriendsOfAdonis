import { defineConfig } from '@adonisjs/otel'
import env from '#start/env'
import { ActionsInstrumentation } from '@foadonis/actions/instrumentation'

export default defineConfig({
  serviceName: env.get('APP_NAME'),
  serviceVersion: env.get('APP_VERSION'),
  environment: env.get('APP_ENV'),

  instrumentations: {
    '@opentelemetry/instrumentation-pg': { enabled: false },
  },

  customInstrumentations: [new ActionsInstrumentation()],
})
