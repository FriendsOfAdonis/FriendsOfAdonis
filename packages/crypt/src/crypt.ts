import { ValidateFn } from '@poppinss/validator-lite/types'
import { Env } from '@adonisjs/core/env'
import { E_PRIVATE_KEY_NOT_FOUND } from './errors.js'
import { CryptPrivateKey } from './private_key.js'

initCrypt()

function initCrypt() {
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

  Env.identifier('encrypted', (value) => {
    if (!privateKey) {
      throw new E_PRIVATE_KEY_NOT_FOUND()
    }

    return privateKey.decrypt(value)
  })
}
