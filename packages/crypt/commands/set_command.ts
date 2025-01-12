import { args } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { CryptBaseCommand } from '../src/base_command.js'
import { EnvFile } from '../src/env_file.js'

export default class SetCommand extends CryptBaseCommand {
  static commandName = 'crypt:set'
  static description = 'Encrypt an environment variable'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare key: string

  @args.string()
  declare value: string

  async run(): Promise<any> {
    const envFile = await EnvFile.load(this.app.makePath(this.filename()))
    const publicKey = await this.createPublicKey()

    if (!publicKey) {
      // await ace.exec('crypt:init', [])
      return
    }

    await envFile.set(this.key, publicKey.encrypt(this.value))

    if (envFile.get(this.key) !== undefined) {
      this.logger.info(`[${this.filename()}] ✔ replaced "${this.key}" with encrypted value`)
    } else {
      this.logger.info(`[${this.filename()}] ✔ set "${this.key}" with encrypted value`)
    }

    await envFile.save()
  }
}
