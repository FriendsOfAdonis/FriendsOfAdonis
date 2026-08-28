import type { ConfigProvider } from '@adonisjs/core/types'
import type { TokenProviderContract } from '../modules/token/types.ts'
import { OTPManagerConfig } from '../modules/otp/manager.ts'
import { MagicLinkManagerConfig } from '../modules/magic_link/manager.ts'
import { PasswordManagerConfig } from '../modules/password/manager.ts'

/**
 * Configuration accepted by the "defineConfig" helper inside
 * "config/sentinel.ts". Each building block (email verification,
 * password management, magic links...) contributes its own options here.
 */
export interface SentinelConfig {
  /**
   * Provider used to persist tokens.
   *
   * @example tokens.lucid({})
   */
  tokens: ConfigProvider<TokenProviderContract>

  /**
   * MagicLink configuration.
   */
  magicLink?: MagicLinkManagerConfig

  /**
   * OTPManager configuration.
   */
  otp?: OTPManagerConfig

  /**
   * PasswordManager configuration.
   */
  password?: PasswordManagerConfig
}

/**
 * Configuration resolved from a "SentinelConfig" and handed to the
 * "Sentinel" service by the provider.
 */
export interface SentinelOptions {
  tokens: TokenProviderContract
  magicLink?: MagicLinkManagerConfig
  otp?: OTPManagerConfig
  password?: PasswordManagerConfig
}

export type RecordId = string | number | bigint
