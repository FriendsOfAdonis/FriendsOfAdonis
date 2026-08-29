import app from '@adonisjs/core/services/app'
import type { MagicLinkManager } from '../modules/magic_link/main.ts'

let magicLink: MagicLinkManager

/**
 * Returns a singleton instance of the MagicLinkManager from the
 * container
 */
await app.booted(async () => {
  magicLink = await app.container.make('sentinel.magic_link')
})

export { magicLink as default }
