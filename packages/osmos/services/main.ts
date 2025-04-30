import app from '@adonisjs/core/services/app'
import { OsmosManager } from '../src/osmos_manager.js'

let osmos: OsmosManager

await app.booted(async () => {
  osmos = await app.container.make('osmos')
})

export { osmos as default }
