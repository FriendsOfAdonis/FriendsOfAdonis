import app from '@adonisjs/core/services/app'
import type { ActionsManager } from '../src/manager.js'

let actions: ActionsManager

await app.booted(async () => {
  actions = await app.container.make('actions')
})

export { actions as default }
