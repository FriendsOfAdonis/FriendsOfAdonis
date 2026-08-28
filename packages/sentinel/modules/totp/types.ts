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

export interface AuthenticatorOptions {
  /**
   * Name displayed in the user authenticator app.
   */
  issuer: string

  /**
   * Length of the generated tokens.
   */
  digits?: number

  /**
   * Interval of time in seconds for which a token is valid.
   */
  period?: number

  /**
   * Number of allowed steps before and after the current step.
   *
   * @default 1
   */
  window?: number

  /**
   * Number of random bytes of the generated secret.
   *
   * @default 40
   */
  secretLength?: number

  /**
   * Length of recovery codes
   *
   * @default 10
   */
  backupCodesLength?: number

  /**
   * Number of recovery codes generated.
   *
   * @default 10
   */
  backupCodesCount?: number

  /**
   * Number of wrong codes tolerated before the authenticator is locked.
   * Without a limit, a short numeric code can be brute-forced.
   *
   * Set it to 0 to never lock the authenticator, for applications rate
   * limiting the verification endpoint themselves.
   *
   * @default 5
   */
  maximumFailedVerifications?: number

  /**
   * Duration of the lock applied once the maximum failed verifications
   * count is reached.
   *
   * @default "15m"
   */
  lockDuration?: string | number
}

export interface CreateAuthenticatorOptions extends Omit<
  AuthenticatorOptions,
  'issuer' | 'window' | 'maximumFailedVerifications' | 'lockDuration'
> {
  /**
   * Account identifier.
   */
  label?: string
}

export interface RegenerateBackupCodesOptions extends Pick<
  AuthenticatorOptions,
  'backupCodesCount' | 'backupCodesLength'
> {}

export interface ValidateAuthenticatorTokenOptions extends Pick<
  AuthenticatorOptions,
  'maximumFailedVerifications' | 'lockDuration'
> {
  /**
   * Number of allowed steps before and after the current step.
   *
   * @default 1
   */
  window?: number
}

export interface TOTPAuthenticableContract {
  $totpOptions: AuthenticatorOptions
}
