import app from '@adonisjs/core/services/app'
import type { TOTPManager } from '../modules/totp/manager.ts'

let totp: TOTPManager

await app.booted(async () => {
  totp = await app.container.make('sentinel.totp')
})

export { totp as default }
