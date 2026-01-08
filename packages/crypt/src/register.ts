import { Env } from '@adonisjs/core/env'
import app from '@adonisjs/core/services/app'
import { CryptPrivateKey } from './private_key.ts'

Env.defineIdentifier('encrypted', async function (value) {
  const privateKey = await CryptPrivateKey.load(app.appRoot, '.env.keys')

  if (!privateKey) {
    throw new Error(`Missing environment variable CRYPT_PRIVATE_KEY`)
  }

  const decrypted = privateKey.decrypt(value)

  return decrypted
})
