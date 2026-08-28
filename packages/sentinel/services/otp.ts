import app from '@adonisjs/core/services/app'
import type { OTPManager } from '../modules/otp/manager.ts'

let otp: OTPManager

await app.booted(async () => {
  otp = await app.container.make('sentinel.otp')
})

export { otp as default }
