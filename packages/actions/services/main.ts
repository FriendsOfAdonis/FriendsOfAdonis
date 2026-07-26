import app from '@adonisjs/core/services/app'
import { type ActionExecutor } from '../src/action_executor.ts'

let actions: ActionExecutor

await app.booted(async () => {
  actions = await app.container.make('actions.executor')
})

export { actions as default }
