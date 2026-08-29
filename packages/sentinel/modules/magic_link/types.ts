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
   * The URL the link points to.
   *
   * Defaults to "magicLink.url" from "config/sentinel.ts"
   */
  url?: string
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
