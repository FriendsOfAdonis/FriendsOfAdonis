import app from '@adonisjs/core/services/app'
import type { MaintenanceService } from '../src/types.js'

let maintenance: MaintenanceService

await app.booted(async () => {
  maintenance = await app.container.make('maintenance')
})

export { maintenance as default }
