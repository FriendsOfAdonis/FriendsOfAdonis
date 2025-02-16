import app from '@adonisjs/core/services/app'
import { Notifier } from '../src/notifier.js'
import { NotifierService } from '../src/types.js'

let notifier: NotifierService

await app.booted(async () => {
  notifier = (await app.container.make(Notifier)) as NotifierService // TODO: Maybe use alias
})

export { notifier as default }
