import { defineConfig } from '@foadonis/openapi'
import { type InferOpenAPIDocuments } from '@foadonis/openapi/types'

const openapiConfig = defineConfig({
  docs: {
    v1: {
      document: {
        info: {
          title: 'My API',
          version: '1.0.0',
        },
      },

      filter: (route) => {
        return route.pattern.startsWith('/api/v1')
      },
    },

    v2: {
      document: {
        info: {
          title: 'My API',
          version: '2.0.0',
        },
      },

      filter: (route) => {
        return route.pattern.startsWith('/api/v2')
      },
    },
  },
})

export default openapiConfig

declare module '@foadonis/openapi/types' {
  interface OpenAPIDocuments extends InferOpenAPIDocuments<typeof openapiConfig> {}
}
