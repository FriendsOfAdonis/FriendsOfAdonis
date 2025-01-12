import { EnvParser } from '@adonisjs/core/env'
import { readFile, writeFile } from 'node:fs/promises'
import { replace } from './utils/replace.js'

/**
 * Utility class to work with dotenv files.
 */
export class EnvFile {
  #path: string
  #content: string
  parsed: Record<string, any>

  constructor(path: string, content: string, parsed: Record<string, any>) {
    this.#path = path
    this.#content = content
    this.parsed = parsed
  }

  /**
   * Loads a dotenv file.
   */
  static async load(path: string) {
    const content = await readFile(path)
      .then((c) => c.toString())
      .catch(() => '')

    const parsed = await new EnvParser(content).parse()

    return new EnvFile(path, content, parsed)
  }

  /**
   * Sets a key=value variable.
   * If the key exists it is replaced at the same location.
   */
  async set(key: string, value: string) {
    this.parsed[key] = value
    this.#content = await replace(this.#content, key, value)
  }

  /**
   * Returns a variable from its key.
   */
  async get(key: string) {
    return this.parsed[key]
  }

  /**
   * Appends the Crypt public key header to the file.
   */
  appendHeader(fileName: string, publicKeyName: string, publicKeyValue: string) {
    const content = [
      `#/---------------------[CRYPT PUBLIC KEY]-----------------------/`,
      `#/             public-key encryption for .env files             /`,
      `#/   [how it works](https://friendsofadonis.com/docs/crypt)     /`,
      `#/--------------------------------------------------------------/`,
      `${publicKeyName}="${publicKeyValue}"`,
      '',
      `# ${fileName}`,
    ]

    this.#content = [...content, this.#content].join('\n')
  }

  /**
   * Save the file to disk.
   */
  async save() {
    await writeFile(this.#path, this.#content)
  }
}
