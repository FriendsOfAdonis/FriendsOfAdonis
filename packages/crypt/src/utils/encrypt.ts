import { encrypt as _encrypt } from 'eciesjs'
import { CryptPublicKey } from '../public_key.js'

export function encrypt(value: string, publicKey: CryptPublicKey) {
  const cipherText = _encrypt(publicKey.value, Buffer.from(value))
  const encoded = Buffer.from(cipherText as any, 'hex').toString('base64')
  return `encrypted:${encoded}`
}
