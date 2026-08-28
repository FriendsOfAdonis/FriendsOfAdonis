import app from '@adonisjs/core/services/app'
import { PasswordManager } from '../modules/password/main.ts'

let password: PasswordManager

await app.booted(async () => {
  password = await app.container.make('sentinel.password')
})

export { password as default }
