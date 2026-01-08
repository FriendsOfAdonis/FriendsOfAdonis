import { createError, Exception } from '@adonisjs/core/exceptions'
import { truncate } from './utils/truncate.ts'
import { keynames } from './utils/keynames.ts'

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

  constructor() {
    super(`Could not decrypt environment variable because encrypted data appears malformed`)
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

export const E_PUBLIC_KEY_NOT_FOUND = class PublicKeyNotFoundException extends Exception {
  static code = 'E_PUBLIC_KEY_NOT_FOUND'

  constructor() {
    super(
      `You do not have any public key provided. Environment variables checked: ${keynames('private')}\nYou can initialize Crypt using "node ace crypt:init"`
    )
  }
}

export const E_ENVIRONMENT_VARIABLE_NOT_FOUND = class EnvironmentVariableNotFound extends Exception {
  static code = 'E_ENVIRONMENT_VARIABLE_NOT_FOUND'

  constructor(name: string, message?: string) {
    super(message ?? `Environment variable "${name}" not found`)
  }
}

export const E_UNKOWN_DECRYPTION_ERROR = createError<[string]>(
  'Decryption error: %s',
  'E_UNKOWN_DECRYPTION_ERROR',
  500
)
