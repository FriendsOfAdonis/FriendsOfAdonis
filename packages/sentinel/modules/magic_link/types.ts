export interface GenerateMagicLinkTokenOptions {
  /**
   * Expiration of the token.
   *
   * @default "20m"
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

export interface GenerateMagicLinkOptions extends GenerateMagicLinkTokenOptions {
  /**
   * URL of the endpoint consuming the link.
   *
   * @default "magicLink.url" from "config/sentinel.ts"
   */
  url: string
}

export interface VerifyMagicLinkTokenOptions {
  /**
   * Purpose the token was generated with. A token generated with
   * a purpose can only be verified with the same purpose.
   */
  purpose?: string
}
