import { BaseCommand, flags } from '@adonisjs/core/ace'
import { CryptPrivateKey } from './private_key.js'
import { CryptPublicKey } from './public_key.js'

export class CryptBaseCommand extends BaseCommand {
  @flags.string({
    description: 'Environment name (default: process.env.NODE_ENV)',
    alias: 'e',
    default: process.env.NODE_ENV,
    parse: (value) => (process.env.NODE_ENV = value),
  })
  declare env?: string

  protected filename() {
    if (!this.env || this.env === 'development') {
      return '.env'
    }

    return `.env.${this.env}`
  }

  protected createPrivateKey() {
    return CryptPrivateKey.create(this.app.makeURL())
  }

  protected createPublicKey() {
    return CryptPublicKey.create(this.app.makeURL())
  }
}
