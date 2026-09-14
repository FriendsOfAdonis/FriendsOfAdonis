import app from '@adonisjs/core/services/app'
import type { OTPManager } from '../modules/otp/manager.ts'

let otp: OTPManager

/**
 * Returns a singleton instance of the OTPManager from the
 * container
 */
await app.booted(async () => {
  otp = await app.container.make('sentinel.otp')
})

export { otp as default }
