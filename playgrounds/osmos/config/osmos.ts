import { defineConfig } from '@foadonis/osmos'

export default defineConfig({
  layout: () => import('#osmos/layouts/root_layout'),
})
