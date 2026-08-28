import type { ConfigProvider } from '@adonisjs/core/types'
import type { TokenProviderContract } from '../modules/token/types.ts'
import { OTPManagerConfig } from '../modules/otp/manager.ts'
import { MagicLinkManagerConfig } from '../modules/magic_link/manager.ts'
import { PasswordManagerConfig } from '../modules/password/manager.ts'
import { TOTPManagerConfig } from '../modules/totp/manager.ts'

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
   * MagicLinkManager configuration. Left out, the manager falls back to
   * the defaults of the package.
   */
  magicLink?: MagicLinkManagerConfig

  /**
   * OTPManager configuration. Left out, the manager falls back to the
   * defaults of the package.
   */
  otp?: OTPManagerConfig

  /**
   * TOTPManager configuration. Left out, the manager falls back to the
   * defaults of the package.
   */
  totp?: TOTPManagerConfig

  /**
   * PasswordManager configuration. Left out, the manager falls back to
   * the defaults of the package.
   */
  password?: PasswordManagerConfig
}

/**
 * Configuration resolved from a "SentinelConfig" and handed to the
 * managers by the provider. Every module is optional, the managers
 * apply the defaults of the package to the options left out.
 */
export interface SentinelOptions {
  tokens: TokenProviderContract
  magicLink?: MagicLinkManagerConfig
  otp?: OTPManagerConfig
  totp?: TOTPManagerConfig
  password?: PasswordManagerConfig
}

export type RecordId = string | number | bigint
