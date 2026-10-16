import { decrypt as _decrypt } from 'eciesjs'
import {
  E_INVALID_PRIVATE_KEY,
  E_MALFORMED_ENCRYPTED_DATA,
  E_UNKOWN_DECRYPTION_ERROR,
} from '../exceptions.ts'
import { type CryptPrivateKey } from '../private_key.js'

/**
 * Decrypts value using CryptPrivateKey.
 */
export function decrypt(value: string, privateKey: CryptPrivateKey) {
  const secret = Buffer.from(privateKey.value, 'hex')
  const cypherText = Buffer.from(value, 'base64')

  try {
    const decrypted = _decrypt(secret, cypherText).toString()
    return decrypted
  } catch (e) {
    if (e.message === 'Invalid private key') {
      throw new E_INVALID_PRIVATE_KEY(privateKey.name, privateKey.value)
    }

    if (e.message === 'Unsupported state or unable to authenticate data') {
      throw new E_INVALID_PRIVATE_KEY(privateKey.name, privateKey.value)
    }

    if (
      e.message ===
      'Point of length 65 was invalid. Expected 33 compressed bytes or 65 uncompressed bytes'
    ) {
      throw new E_MALFORMED_ENCRYPTED_DATA()
    }

    throw new E_UNKOWN_DECRYPTION_ERROR([e.message])
  }
}
