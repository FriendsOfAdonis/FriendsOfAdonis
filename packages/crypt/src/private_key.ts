import { EnvParser } from '@adonisjs/core/env'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decrypt } from './utils/decrypt.ts'
import { keynames } from './utils/keynames.ts'

/**
 * Private key used for decrypting secrets.
 *
 * @example
 *
 * const privateKey = await CryptPrivateKey.load(app.appRoot, '.env.keys')
 * const decrypted = privateKey.decrypt(encrypted)
 */
export class CryptPrivateKey {
  constructor(
    public name: string,
    public value: string
  ) {}

  /**
   * Loads a PrivateKey from environment variables or a file.
   *
   * @param appRoot - absolute path to the root directory
   * @param file - environment file name containing private keys
   */
  static async load(appRoot: URL | string, file = '.env.keys') {
    let key = await this.fromEnv()
    if (key) {
      return key
    }

    const path = join(fileURLToPath(appRoot), file)
    key = await this.fromFile(path)
    return key
  }

  static async fromEnv() {
    for (const keyName of keynames('private')) {
      if (process.env[keyName]) {
        return new CryptPrivateKey(keyName, process.env[keyName])
      }
    }
  }

  /**
   * Loads a private key from a .env file.
   *
   * @param - path to the env file containing privates keys
   */
  static async fromFile(path: string | URL) {
    const content = await readFile(path)
      .then((c) => c.toString())
      .catch(() => '')
    const parsed = await new EnvParser(content, new URL(import.meta.url)).parse()

    for (const keyName of keynames('private')) {
      if (!parsed[keyName]) continue
      return new CryptPrivateKey(keyName, parsed[keyName])
    }
  }

  /**
   * Decrypt a value using this private key.
   *
   * @param value - the value to decrypt
   */
  decrypt(value: string) {
    return decrypt(value, this)
  }
}
