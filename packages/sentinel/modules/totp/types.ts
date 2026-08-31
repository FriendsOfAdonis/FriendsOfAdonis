import type { TOTPManager } from './manager.ts'

/**
 * Hashing algorithms supported by the authenticator apps
 */
export type TOTPAlgorithm =
  | 'SHA1'
  | 'SHA224'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'SHA3-224'
  | 'SHA3-256'
  | 'SHA3-384'
  | 'SHA3-512'

/**
 * Options accepted to configure the authenticators. They are defined
 * inside "config/sentinel.ts", overridden by the "withTOTP" mixin,
 * then by the options of each call.
 */
export interface AuthenticatorOptions {
  /**
   * Name of the application, displayed by the authenticator app
   */
  issuer: string

  /**
   * Number of digits of a code.
   *
   * Defaults to 6
   */
  digits?: number

  /**
   * Duration of a time step, in seconds.
   *
   * Defaults to 30
   */
  period?: number

  /**
   * Number of time steps accepted on either side of the current one,
   * to tolerate clock drift.
   *
   * Defaults to 1
   */
  window?: number

  /**
   * Hashing algorithm of the codes. Some authenticator apps only
   * support SHA1.
   *
   * Defaults to "SHA1"
   */
  algorithm?: TOTPAlgorithm

  /**
   * Length of the secret in bytes, before base32 encoding.
   *
   * Defaults to 40
   */
  secretLength?: number

  /**
   * Number of characters of a backup code, separator aside.
   *
   * Defaults to 10
   */
  backupCodesLength?: number

  /**
   * Number of backup codes generated for an authenticator.
   *
   * Defaults to 10
   */
  backupCodesCount?: number

  /**
   * Number of consecutive failed verifications after which the
   * authenticator is locked. Use 0 to never lock, for applications
   * rate limiting the endpoint themselves.
   *
   * Defaults to 5
   */
  maximumFailedVerifications?: number

  /**
   * Duration of the lock, in seconds or as a duration string like
   * "15m".
   *
   * Defaults to "15m"
   */
  lockDuration?: string | number
}

/**
 * Options accepted when creating an authenticator.
 *
 * Deliberately narrow: digits, period and algorithm are read again at
 * every validation, so they belong to the config or the mixin rather
 * than to one enrollment. The label comes from "getTOTPLabel", so
 * that every enrollment of an account agrees on it.
 */
export interface CreateAuthenticatorOptions extends Pick<
  AuthenticatorOptions,
  'secretLength' | 'backupCodesCount' | 'backupCodesLength'
> {}

/**
 * Options accepted when regenerating the backup codes of an
 * authenticator
 */
export interface RegenerateBackupCodesOptions extends Pick<
  AuthenticatorOptions,
  'backupCodesCount' | 'backupCodesLength'
> {}

/**
 * Options accepted when validating a code
 */
export interface ValidateAuthenticatorTokenOptions extends Pick<
  AuthenticatorOptions,
  'maximumFailedVerifications' | 'lockDuration'
> {
  /**
   * Number of time steps accepted on either side of the current one.
   *
   * Defaults to 1
   */
  window?: number
}

/**
 * A set of properties a model must implement to own authenticators.
 * The "withTOTP" mixin implements them.
 */
export interface TOTPAuthenticableContract {
  /**
   * Returns the options of the authenticators of the model
   */
  getTOTPOptions(): AuthenticatorOptions

  /**
   * Returns the label displayed by the authenticator app, usually the
   * email of the account
   */
  getTOTPLabel(): string

  /**
   * Returns the manager encrypting and decrypting the secrets of the
   * authenticators of the model
   */
  getTOTPManager(): TOTPManager
}
