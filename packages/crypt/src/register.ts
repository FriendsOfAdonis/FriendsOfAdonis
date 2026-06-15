import { Env } from '@adonisjs/core/env'
import { CryptPrivateKey } from './private_key.ts'
import { pathToFileURL } from 'node:url'

Env.defineIdentifier('encrypted', async function (value) {
  const privateKey = await CryptPrivateKey.load(pathToFileURL(process.cwd()), '.env.keys')

  if (!privateKey) {
    throw new Error(`Missing environment variable CRYPT_PRIVATE_KEY`)
  }

  const decrypted = privateKey.decrypt(value)

  return decrypted
})
