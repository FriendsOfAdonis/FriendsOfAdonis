import app from '@adonisjs/core/services/app'
import type { EmailManager } from '../modules/email/main.ts'

let email: EmailManager

/**
 * Returns a singleton instance of the EmailManager from the
 * container
 */
await app.booted(async () => {
  email = await app.container.make('sentinel.email')
})

export { email as default }
