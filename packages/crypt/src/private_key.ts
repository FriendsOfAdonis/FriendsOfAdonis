import { EnvParser } from '@adonisjs/core/env'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decrypt } from './utils/decrypt.js'
import { keynames } from './utils/keynames.js'

export class CryptPrivateKey {
  constructor(
    public name: string,
    public value: string
  ) {}

  static async create(appRoot: URL | string, file = '.env.keys') {
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

  static async fromFile(path: string) {
    const content = await readFile(join(path))
      .then((c) => c.toString())
      .catch(() => '')
    const parsed = await new EnvParser(content).parse()

    for (const keyName of keynames('private')) {
      if (parsed[keyName]) {
        return new CryptPrivateKey(keyName, parsed[keyName])
      }
    }
  }

  decrypt(key: string, value: string) {
    return decrypt(key, value, this)
  }
}
