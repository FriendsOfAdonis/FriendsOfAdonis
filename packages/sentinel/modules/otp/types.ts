export interface GenerateOTPOptions {
  /**
   * Length of the OTP code.
   *
   * @default 6
   */
  length?: number

  /**
   * Expiration of the OTP.
   *
   * @default "20m"
   */
  expiresIn?: string | number

  /**
   * Number of wrong codes tolerated before the OTP is invalidated.
   * Without a limit, a short numeric code can be brute-forced
   * within its lifetime.
   *
   * @default "otp.maximumFailedAttempts" from "config/sentinel.ts"
   */
  maximumFailedAttempts?: number

  /**
   * Purpose to ensure that the OTP cannot be used
   * for a different purpose than the one given originally.
   */
  purpose?: string

  /**
   * Additional metadata associated to the generated OTP.
   * Useful for storing a redirect URL.
   */
  metadata?: Record<string, unknown>
}

export interface VerifyOTPOptions {
  /**
   * Purpose the OTP was generated with. An OTP generated with
   * a purpose can only be verified with the same purpose.
   */
  purpose?: string
}
