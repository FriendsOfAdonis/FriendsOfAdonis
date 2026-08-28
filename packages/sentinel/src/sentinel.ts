import type { HashManager } from '@adonisjs/core/hash'
import { MagicLinkManager } from '../modules/magic_link/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import type { SentinelOptions } from './types.ts'
import { PasswordManager } from '../modules/password/manager.ts'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { TOTPManager } from '../modules/totp/manager.ts'
import { EncryptionManager } from '@adonisjs/core/encryption'

/**
 * Entry point of the Sentinel package. Registered as a singleton inside the
 * container, it exposes the authentication building blocks (email
 * verification, password management, magic links...).
 */
export class Sentinel {
  readonly tokens: TokenManager
  readonly totp: TOTPManager

  protected $password?: PasswordManager
  protected $magicLink?: MagicLinkManager

  constructor(
    readonly options: SentinelOptions,
    hash: HashManager<never>,
    encryption: EncryptionManager<any>
  ) {
    this.tokens = new TokenManager(options.tokens, hash)

    if (options.magicLink) {
      this.$magicLink = new MagicLinkManager(options.magicLink, this.tokens)
    }

    this.totp = new TOTPManager(encryption)

    if (options.password) {
      this.$password = new PasswordManager(options.password, this.tokens, hash)
    }
  }

  get magicLink() {
    if (!this.$magicLink) {
      throw new RuntimeException(
        'MagicLink is not configured. Make sure you have configured `config/sentinel.ts`.'
      )
    }

    return this.$magicLink
  }

  get password() {
    if (!this.$password) {
      throw new RuntimeException(
        'Password is not configured. Make sure you have configured `config/sentinel.ts`.'
      )
    }

    return this.$password
  }
}
