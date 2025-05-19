import { defineConfig } from '@foadonis/spark'

export default defineConfig({
  layout: (ctx) => {
    if (ctx.request.url().startsWith('/admin')) {
      return () => import('@foadonis/cockpit/components/layouts/root_layout')
    }

    return () => import('#spark/layouts/root_layout')
  },
})
