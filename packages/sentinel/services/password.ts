import app from '@adonisjs/core/services/app'
import type { PasswordManager } from '../modules/password/main.ts'

let password: PasswordManager

/**
 * Returns a singleton instance of the PasswordManager from the
 * container
 */
await app.booted(async () => {
  password = await app.container.make('sentinel.password')
})

export { password as default }
