import app from '@adonisjs/core/services/app'
import type { ActionsRunner } from '../src/runner.ts'

let actions: ActionsRunner

await app.booted(async () => {
  actions = await app.container.make('actions')
})

export { actions as default }
