import { ValidateFn } from '@poppinss/validator-lite/types'
import { Env } from '@adonisjs/core/env'
import { E_PRIVATE_KEY_NOT_FOUND } from './errors.js'
import { CryptPrivateKey } from './private_key.js'
import { isEncrypted } from './utils/is_encrypted.js'

await initCrypt()

async function initCrypt() {
  let privateKey: CryptPrivateKey | undefined
  const initialCreate = Env.create
  Env.create = async function <Schema extends { [key: string]: ValidateFn<unknown> }>(
    this: Env<any>,
    appRoot: URL,
    schema: Schema
  ) {
    privateKey = await CryptPrivateKey.create(appRoot, '.env.keys')
    const test = initialCreate.bind(this)(appRoot, schema)
    return test
  }

  const initialGet = Env.prototype.get
  Env.prototype.get = function (this: Env<any>, key: string, defaultValue?: string) {
    const value = initialGet.bind(this)(key, defaultValue)

    if (typeof value !== 'string') return value
    const encrypted = isEncrypted(value)

    if (!encrypted) return value

    if (!privateKey) {
      throw new E_PRIVATE_KEY_NOT_FOUND(key)
    }

    return privateKey.decrypt(key, encrypted)
  }
}
