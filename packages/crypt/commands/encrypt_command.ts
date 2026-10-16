import { args } from '@adonisjs/core/ace'
import { CryptBaseCommand } from '../src/base_command.js'
import { EnvFile } from '../src/env_file.js'

export default class EncryptCommand extends CryptBaseCommand {
  static commandName = 'env:encrypt'
  static description = 'Encrypt an environment variable'

  @args.string({ required: false })
  declare key?: string

  @args.string({ required: false })
  declare value?: string

  async run(): Promise<any> {
    const key = await this.#getKey()
    const value = await this.#getValue()

    let envFile = await EnvFile.load(this.app.makePath(this.filename()))
    let publicKey = await this.createPublicKey()

    if (!publicKey) {
      await this.kernel.exec('crypt:init', [])
      envFile = await EnvFile.load(this.app.makePath(this.filename()))
      publicKey = await this.createPublicKey()

      if (!publicKey) {
        this.logger.error(
          `An error occured during initialization. Try to run "node ace crypt:init manually."`
        )
        return
      }
    }

    await envFile.set(key, `encrypted:${publicKey.encrypt(value)}`)

    if (envFile.get(key) !== undefined) {
      this.logger.success(`[${this.filename()}] replaced "${key}" with encrypted value`)
    } else {
      this.logger.success(`[${this.filename()}] set "${key}" with encrypted value`)
    }

    await envFile.save()
  }

  async #getValue() {
    if (this.value) return this.value
    return this.prompt.ask('Environment value', {
      default: this.key ? process.env[this.key] : undefined,
    })
  }

  async #getKey() {
    if (this.key) return this.key
    return this.prompt.ask('Environment key')
  }
}
