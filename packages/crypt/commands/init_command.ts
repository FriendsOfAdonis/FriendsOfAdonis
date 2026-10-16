import { CryptBaseCommand } from '../src/base_command.js'
import { EnvFile } from '../src/env_file.ts'
import { KeysFile } from '../src/keys_file.ts'
import { keyname } from '../src/utils/keynames.ts'
import { keypair } from '../src/utils/keypair.ts'

export default class InitCommand extends CryptBaseCommand {
  static commandName = 'crypt:init'
  static description = 'Generate new keypair to configure encryption'

  async run(): Promise<any> {
    const keys = await KeysFile.load(this.app.makePath('.env.keys'))

    const privateKeyName = keyname('private')

    if (keys.get(privateKeyName)) {
      this.logger.warning(
        `A private key ${privateKeyName} already exist in .env.keys, use 'node ace crypt:rotate' to update existing keys.`
      )
      return
    }

    const publicKeyName = keyname('public')

    const keyPair = keypair()
    const envFile = await EnvFile.load(this.app.makePath(this.filename()))

    envFile.appendHeader(this.filename(), publicKeyName, keyPair.publicKey)
    keys.set(privateKeyName, keyPair.privateKey)

    await envFile.save()
    this.logger.success(`[${this.filename()}] generated "${publicKeyName}" public key`)
    this.logger.success(`[.env.keys] generated "${privateKeyName}" private key`)

    await keys.save()

    return keyPair
  }
}
