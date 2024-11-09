import env from '#start/env'
import path from 'node:path'
import { defineConfig } from '@foadonis/graphql'

export default defineConfig({
  apollo: {
    introspection: env.get('NODE_ENV') !== 'production',
    playground: env.get('NODE_ENV') !== 'production',
  },
  emitSchemaFile: path.resolve(import.meta.dirname, '../schema.graphql'),
})
