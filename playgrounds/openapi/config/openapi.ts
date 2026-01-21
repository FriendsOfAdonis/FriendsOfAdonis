import { CustomVineLoader } from '#loaders/custom_vine_loader'
import { defineConfig } from '@foadonis/openapi'

export default defineConfig({
  ui: 'scalar',
  document: {
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  loaders: [CustomVineLoader],
})
