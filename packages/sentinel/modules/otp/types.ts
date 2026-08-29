/**
 * Options accepted when generating a code
 */
export interface GenerateOTPOptions {
  /**
   * Number of digits of the code.
   *
   * Defaults to "otp.length" from "config/sentinel.ts", then 6
   */
  length?: number

  /**
   * The lifetime of the code, in seconds or as a duration string
   * like "20m".
   *
   * Defaults to "otp.expiresIn" from "config/sentinel.ts", then "20m"
   */
  expiresIn?: string | number

  /**
   * Number of failed attempts after which the code is invalidated.
   *
   * Defaults to "otp.maximumFailedAttempts" from "config/sentinel.ts", then 5
   */
  maximumFailedAttempts?: number

  /**
   * The purpose the code is generated for. It must be given again to
   * verify the code.
   */
  purpose?: string

  /**
   * Arbitrary data handed back by the verification, a redirect URL
   * for example
   */
  metadata?: Record<string, unknown>
}

/**
 * Options accepted when verifying a code
 */
export interface VerifyOTPOptions {
  /**
   * The purpose the code was generated with, if any
   */
  purpose?: string
}

/**
 * Options accepted when invalidating the codes of a subject
 */
export interface InvalidateOTPsOptions {
  /**
   * The purpose of the codes to invalidate. A null value targets
   * the codes without a purpose, leaving the option out targets
   * every purpose.
   */
  purpose?: string | null
}
