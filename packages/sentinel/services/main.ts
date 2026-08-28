import app from '@adonisjs/core/services/app'
import type { Sentinel } from '../src/sentinel.ts'

let sentinel: Sentinel

await app.booted(async () => {
  sentinel = await app.container.make('sentinel')
})

export { sentinel as default }
