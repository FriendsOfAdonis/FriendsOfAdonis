import { args } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { isEncrypted } from '../src/utils/is_encrypted.js'
import { E_PRIVATE_KEY_NOT_FOUND } from '../src/errors.js'
import { CryptBaseCommand } from '../src/base_command.js'
import { CryptPrivateKey } from '../src/private_key.js'
import { EnvFile } from '../src/env_file.js'

export default class GetCommand extends CryptBaseCommand {
  static commandName = 'crypt:get'
  static description = 'Decrypt an environment variable'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ required: false })
  declare key?: string

  async run(): Promise<any> {
    const privateKey = await this.createPrivateKey()

    if (!privateKey) {
      throw new E_PRIVATE_KEY_NOT_FOUND(this.key)
    }

    const envFile = await EnvFile.load(this.app.makePath(this.filename()))

    if (this.key) {
      this.renderKeyTable(privateKey, this.key, envFile.parsed)
    } else {
      this.renderTable(privateKey, envFile.parsed)
    }
  }

  renderKeyTable(privateKey: CryptPrivateKey, key: string, parsed: Record<string, string>) {
    const value = parsed[key]
    const encrypted = isEncrypted(value)

    const t = this.ui.table()
    t.head([this.filename()])
    t.row(['Key', key])
    t.row(['Value', encrypted ? privateKey.decrypt(key, encrypted) : value])
    t.row(['Encrypted', String(Boolean(encrypted))])
    t.render()
  }

  renderTable(privateKey: CryptPrivateKey, parsed: Record<string, string>) {
    const t = this.ui.table()
    t.head(['Key', 'Value', 'Encrypted'])

    for (const [key, value] of Object.entries(parsed)) {
      const encrypted = isEncrypted(value)
      t.row([
        key,
        encrypted ? privateKey.decrypt(key, encrypted) : value,
        String(Boolean(encrypted)),
      ])
      t.render()
    }
  }
}
