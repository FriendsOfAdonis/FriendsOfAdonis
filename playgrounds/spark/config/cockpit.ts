import { defineConfig } from '@foadonis/cockpit'

export default defineConfig({
  menu: () => import('#cockpit/menu'),
  resources: {
    autoload: true,
  },
})
