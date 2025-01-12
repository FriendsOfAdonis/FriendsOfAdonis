import { EnvProcessor } from '@adonisjs/core/env'
import { keynames } from './utils/keynames.js'
import { encrypt } from './utils/encrypt.js'

export class CryptPublicKey {
  constructor(
    public name: string,
    public value: string
  ) {}

  static async create(appRoot: URL) {
    const env = await new EnvProcessor(appRoot).process()

    for (const keyname of keynames('public')) {
      if (env[keyname]) {
        return new CryptPublicKey(keyname, env[keyname])
      }
    }
  }

  encrypt(value: string) {
    return encrypt(value, this)
  }
}
