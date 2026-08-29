import type { ConfigProvider } from '@adonisjs/core/types'
import type { TokenProviderContract } from '../modules/token/types.ts'
import { OTPManagerConfig } from '../modules/otp/manager.ts'
import { MagicLinkManagerConfig } from '../modules/magic_link/manager.ts'
import { PasswordManagerConfig } from '../modules/password/manager.ts'
import { TOTPManagerConfig } from '../modules/totp/manager.ts'

/**
 * Config accepted by the "defineConfig" method
 */
export interface SentinelConfig {
  /**
   * The provider used to persist the tokens of the OTP, magic link
   * and password modules. Use the "tokens.lucid()" helper to store
   * them in the database.
   */
  tokens: ConfigProvider<TokenProviderContract>

  /**
   * Config of the magic link manager. The manager cannot be resolved
   * from the container when left out.
   */
  magicLink?: MagicLinkManagerConfig

  /**
   * Config of the OTP manager
   */
  otp?: OTPManagerConfig

  /**
   * Config of the TOTP manager. The manager cannot be resolved from
   * the container when left out.
   */
  totp?: TOTPManagerConfig

  /**
   * Config of the password manager
   */
  password?: PasswordManagerConfig
}

/**
 * Resolved config, as consumed by the service provider
 */
export interface SentinelOptions {
  tokens: TokenProviderContract
  magicLink?: MagicLinkManagerConfig
  otp?: OTPManagerConfig
  totp?: TOTPManagerConfig
  password?: PasswordManagerConfig
}

/**
 * Accepted values for the primary key of a record. It can be an
 * integer, a bigInteger or a UUID or any other string based value.
 */
export type RecordId = string | number | bigint
