/**
 * Options accepted when creating a password reset token
 */
export interface GeneratePasswordResetTokenOptions {
  /**
   * The lifetime of the token, in seconds or as a duration string
   * like "1h".
   *
   * Defaults to "password.expiresIn" from "config/sentinel.ts", then "1h"
   */
  expiresIn?: string | number

  /**
   * The purpose the token is created for. It must be given again to
   * verify the token.
   */
  purpose?: string

  /**
   * Arbitrary data handed back by the verification, a redirect URL
   * for example
   */
  metadata?: Record<string, unknown>
}

/**
 * Options accepted when verifying a password reset token
 */
export interface VerifyPasswordResetTokenOptions {
  /**
   * The purpose the token was created with, if any
   */
  purpose?: string
}

/**
 * Options accepted when invalidating the password reset tokens of a
 * subject
 */
export interface InvalidatePasswordResetTokensOptions {
  /**
   * The purpose of the tokens to invalidate. A null value targets
   * the tokens without a purpose, leaving the option out targets
   * every purpose.
   */
  purpose?: string | null
}
