import app from '@adonisjs/core/services/app'
import type { FlowService } from '../src/types.js'

let flow: FlowService

await app.booted(async () => {
  flow = await app.container.make('flow')
})

export { flow as default }
