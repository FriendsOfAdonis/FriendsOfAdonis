/**
 * Builds the URL of a magic link from its token. The URL must be
 * absolute, since the link is sent by email.
 *
 * @example
 * const url: MagicLinkUrlBuilder = (token) =>
 *   `https://example.com/auth/magic-link?token=${token}`
 */
export type MagicLinkUrlBuilder = (token: string) => string

/**
 * Options accepted when generating a magic link token
 */
export interface GenerateMagicLinkTokenOptions {
  /**
   * The lifetime of the token, in seconds or as a duration string
   * like "20m".
   *
   * Defaults to "magicLink.expiresIn" from "config/sentinel.ts", then "20m"
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
 * Options accepted when generating a magic link
 */
export interface GenerateMagicLinkOptions extends GenerateMagicLinkTokenOptions {
  /**
   * Builds the URL of the link from its token. The URL must be
   * absolute, since the link is sent by email.
   *
   * Defaults to "magicLink.url" from "config/sentinel.ts"
   */
  url?: MagicLinkUrlBuilder
}

/**
 * Options accepted when verifying a magic link token
 */
export interface VerifyMagicLinkTokenOptions {
  /**
   * The purpose the token was created with, if any
   */
  purpose?: string
}

/**
 * Options accepted when invalidating the magic link tokens of a
 * subject
 */
export interface InvalidateMagicLinkTokensOptions {
  /**
   * The purpose of the tokens to invalidate. A null value targets
   * the tokens without a purpose, leaving the option out targets
   * every purpose.
   */
  purpose?: string | null
}
