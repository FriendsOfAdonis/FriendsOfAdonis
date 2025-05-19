import app from '@adonisjs/core/services/app'
import { CockpitManager } from '../src/cockpit_manager.js'

let cockpit: CockpitManager

await app.booted(async () => {
  cockpit = await app.container.make(CockpitManager)
})

export { cockpit as default }
