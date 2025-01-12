import { EnvParser } from '@adonisjs/core/env'
import { readFile, writeFile } from 'node:fs/promises'

/**
 * Utility class to work with dotenv keys file (.env.keys).
 */
export class KeysFile {
  constructor(
    public path: string,
    public keys: Record<string, string>
  ) {}

  /**
   * Loads a dotenv file.
   */
  static async load(path: string) {
    const content = await readFile(path)
      .then((c) => c.toString())
      .catch(() => '')

    const parsed = await new EnvParser(content).parse()

    return new KeysFile(path, parsed)
  }

  /**
   * Sets a key=value variable.
   */
  set(key: string, value: string) {
    this.keys[key] = value
  }

  /**
   * Returns a variable from its key.
   */
  get(key: string) {
    return this.keys[key]
  }

  /**
   * Save the file to disk.
   */
  async save() {
    const content = [
      `#/---------------------!CRYPT PRIVATE KEYS!-----------------------/`,
      `#/    private decryption keys. DO NOT commit to source control    /`,
      `#/     [how it works](https://friendsofadonis.com/docs/crypt)     /`,
      `#/----------------------------------------------------------------/`,
    ]

    for (const [key, value] of Object.entries(this.keys)) {
      const file = `.env${key.replace('CRYPT_PRIVATE_KEY', '').split('_').join('.').toLowerCase()}`
      content.push(...['', `# ${file}`, `${key}="${value}"`])
    }

    await writeFile(this.path, content.join('\n'))
  }
}
