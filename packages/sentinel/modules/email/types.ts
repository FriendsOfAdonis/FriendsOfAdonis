/**
 * Options accepted when generating an email verification token
 */
export interface GenerateEmailVerificationTokenOptions {
  /**
   * The lifetime of the token, in seconds or as a duration string
   * like "1d".
   *
   * Defaults to "email.expiresIn" from "config/sentinel.ts", then "1d"
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
 * Options accepted when verifying an email verification token
 */
export interface VerifyEmailVerificationTokenOptions {
  /**
   * The purpose the token was created with, if any
   */
  purpose?: string
}

/**
 * Options accepted when invalidating the email verification tokens
 * of a subject
 */
export interface InvalidateEmailVerificationTokensOptions {
  /**
   * The purpose of the tokens to invalidate. Leaving the option out
   * targets the tokens without a purpose.
   */
  purpose?: string
}
