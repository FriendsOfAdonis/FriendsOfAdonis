import app from '@adonisjs/core/services/app'
import type { FlickService } from '../src/types.ts'

let flick: FlickService

await app.booted(async () => {
  flick = await app.container.make('flick')
})

export { flick as default }
