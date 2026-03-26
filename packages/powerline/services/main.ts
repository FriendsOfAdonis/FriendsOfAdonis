import app from '@adonisjs/core/services/app'
import { type Powerline } from '../src/powerline_server.ts'

let powerline: Powerline

await app.booted(async () => {
  powerline = await app.container.make('powerline')
})

export { powerline as default }
