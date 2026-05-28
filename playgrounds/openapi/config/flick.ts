import { features } from '#generated/features'
import { defineConfig, drivers } from '@foadonis/flick'
import { InferFeatures } from '@foadonis/flick/types'

export default defineConfig({
  features,
  driver: 'memory',
  drivers: {
    memory: drivers.memory(),
  },
})

declare module '@foadonis/flick/types' {
  interface KnownFeatures extends InferFeatures<typeof features> {}
}
