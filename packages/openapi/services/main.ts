import app from '@adonisjs/core/services/app'
import { type OpenAPIService } from '../src/types.ts'

let openapi: OpenAPIService

await app.booted(async () => {
  openapi = await app.container.make('openapi')
})

export { openapi as default }
