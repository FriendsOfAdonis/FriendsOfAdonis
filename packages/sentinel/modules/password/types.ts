export interface GeneratePasswordResetTokenOptions {
  /**
   * Expiration of the token.
   *
   * @default "password.expiresIn" from "config/sentinel.ts"
   */
  expiresIn?: string | number

  /**
   * Purpose to ensure that the token cannot be used
   * for a different purpose than the one given originally.
   */
  purpose?: string

  /**
   * Additional metadata associated to the generated token.
   * Useful for storing a redirect URL.
   */
  metadata?: Record<string, unknown>
}

export interface VerifyPasswordResetTokenOptions {
  /**
   * Purpose the token was generated with. A token generated with
   * a purpose can only be verified with the same purpose.
   */
  purpose?: string
}

export interface InvalidatePasswordResetTokensOptions {
  /**
   * Purpose of the tokens to invalidate. `null` targets tokens without
   * a purpose, leaving it out targets tokens of every purpose.
   */
  purpose?: string | null
}
