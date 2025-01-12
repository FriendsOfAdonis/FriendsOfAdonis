import { schema as envSchema } from '@poppinss/validator-lite'
import { ValidateFn } from '@poppinss/validator-lite/types'
import { Env } from '@adonisjs/core/env'
import { E_NOT_INITIALIZED_ERROR, E_PRIVATE_KEY_NOT_FOUND } from './errors.js'
import { CryptPrivateKey } from './private_key.js'
import { isEncrypted } from './utils/is_encrypted.js'

export type CryptConfig = {
  /**
   * Path to the environment file containing private keys.
   *
   * @default .env.keys
   */
  keysPath?: string
}

type ValidateFnFn<T> = () => ValidateFn<T>

/**
 * A wrapper around `Env` to work with encrypted environment variables.
 */
export class Crypt {
  static #initialized = false
  static #privateKey?: CryptPrivateKey

  /**
   * Initialize Crypt decryption key and call `Env.create`.
   *
   * @example
   * ```
   * Crypt.create(appRoot, {
   *  PORT: Env.schema.number(),
   *  DB_PASSWORD: Crypt.secret()
   * })
   * ```
   */
  static async create<Schema extends { [key: string]: ValidateFn<unknown> }>(
    appRoot: URL,
    schema: Schema,
    config?: CryptConfig
  ): Promise<
    Env<{
      [K in keyof Schema]: ReturnType<Schema[K]>
    }>
  > {
    this.#privateKey = await CryptPrivateKey.create(appRoot, config?.keysPath)
    this.#initialized = true

    return Env.create(appRoot, {
      ...schema,
    })
  }

  /**
   * Marks this environment variable as secret.
   * If the value is encrypted, Crypt will try to decrypt it automatically.
   *
   * @example
   * ```
   * Crypt.create(appRoot, {
   *  DB_PASSWORD: Crypt.secret()
   * })
   * ```
   */
  static get secret(): ValidateFnFn<string> & { optional: ValidateFnFn<string | undefined> } {
    const decrypt = (key: string, value: string) => {
      if (!this.#initialized) {
        throw new E_NOT_INITIALIZED_ERROR()
      }

      const encrypted = isEncrypted(value)
      if (encrypted) {
        if (!this.#privateKey) {
          throw new E_PRIVATE_KEY_NOT_FOUND(key)
        }

        return this.#privateKey.decrypt(key, encrypted)
      }

      return value
    }

    const schema = () => (key: string, value: string | undefined) => {
      const validated = envSchema.string()(key, value)
      return decrypt(key, validated)
    }

    schema.optional = () => (key: string, value: string | undefined) => {
      const validated = envSchema.string.optional()(key, value)
      if (!validated) return validated
      return decrypt(key, validated)
    }

    return schema
  }
}
