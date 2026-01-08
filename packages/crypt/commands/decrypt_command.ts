import { args } from '@adonisjs/core/ace'
import { E_PRIVATE_KEY_NOT_FOUND } from '../src/exceptions.ts'
import { CryptBaseCommand } from '../src/base_command.ts'
import { CryptPrivateKey } from '../src/private_key.ts'
import { EnvFile } from '../src/env_file.ts'
import { isEncrypted } from '../src/utils/is_encrypted.ts'

export default class DecryptCommand extends CryptBaseCommand {
  static commandName = 'env:decrypt'
  static description = 'Decrypt an environment variable'

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

    const table = this.ui.table()
    table.head([this.filename()])
    table.row(['Key', key])
    table.row(['Value', encrypted ? privateKey.decrypt(encrypted) : value])
    table.row(['Encrypted', String(Boolean(encrypted))])
    table.render()
  }

  renderTable(privateKey: CryptPrivateKey, parsed: Record<string, string>) {
    const table = this.ui.table()
    table.head(['Key', 'Value', 'Encrypted'])

    for (const [key, value] of Object.entries(parsed)) {
      const encrypted = isEncrypted(value)
      table.row([
        key,
        encrypted ? privateKey.decrypt(encrypted) : value,
        String(Boolean(encrypted)),
      ])
    }

    table.render()
  }
}
