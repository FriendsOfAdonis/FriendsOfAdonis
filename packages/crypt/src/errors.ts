import { createError, Exception } from '@adonisjs/core/exceptions'
import { truncate } from './utils/truncate.js'
import { keynames } from './utils/keynames.js'

export const E_NOT_INITIALIZED_ERROR = createError(
  'Crypt is not initialized. Make sure you replace `Env.create` with `Crypt.create`',
  'E_NOT_INITIALIZED_ERROR',
  500
)

export const E_INVALID_PRIVATE_KEY = class InvalidPrivateKeyException extends Exception {
  static code = 'E_INVALID_PRIVATE_KEY'

  constructor(key: string, privateKeyName: string, privateKeyValue?: string) {
    super(
      `Could not decrypt "${key}" using private key "${privateKeyName}=${truncate(privateKeyValue ?? '')}"`
    )
  }
}

export const E_MALFORMED_ENCRYPTED_DATA = class MalformedEncryptedDataException extends Exception {
  static code = 'E_MALFORMED_ENCRYPTED_DATA'

  constructor(key: string) {
    super(`Could not decrypt "${key}" because encrypted data appears malformed`)
  }
}

export const E_PRIVATE_KEY_NOT_FOUND = class PrivateKeyNotFoundException extends Exception {
  static code = 'E_PRIVATE_KEY_NOT_FOUND'

  constructor(key?: string) {
    super(
      key
        ? `"${key}" is encrypted but you do not have any private key provided. Environment variables checked: ${keynames('private')}`
        : `You do not have any private key provided. Environment variables checked: ${keynames('private')}`
    )
  }
}

export const E_UNKOWN_DECRYPTION_ERROR = createError<[string]>(
  'Decryption error: %s',
  'E_UNKOWN_DECRYPTION_ERROR',
  500
)
