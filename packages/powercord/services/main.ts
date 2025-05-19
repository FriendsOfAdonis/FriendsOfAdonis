import app from '@adonisjs/core/services/app'
import { PowercordServer } from '../src/server.js'

let powercord: PowercordServer

await app.booted(async () => {
  powercord = await app.container.make('powercord')
})

export { powercord as default }
