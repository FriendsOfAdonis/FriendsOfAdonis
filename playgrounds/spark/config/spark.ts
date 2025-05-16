import { defineConfig } from '@foadonis/spark'

export default defineConfig({
  layout: () => import('#spark/layouts/root_layout'),
})
