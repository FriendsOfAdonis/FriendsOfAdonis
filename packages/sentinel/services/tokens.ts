import app from '@adonisjs/core/services/app'
import type { TokenManager } from '../modules/token/manager.ts'

let tokens: TokenManager

await app.booted(async () => {
  tokens = await app.container.make('sentinel.tokens')
})

export { tokens as default }
