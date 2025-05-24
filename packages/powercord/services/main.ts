import app from '@adonisjs/core/services/app'
import { PowercordManager } from '../src/manager.js'

let powercord: PowercordManager

await app.booted(async () => {
  powercord = await app.container.make('powercord')
})

export { powercord as default }
