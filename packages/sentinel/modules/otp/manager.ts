import { Secret } from '@adonisjs/core/helpers'
import { GenerateOTPOptions, VerifyOTPOptions } from './types.ts'
import { TokenManager } from '../token/manager.ts'
import { RecordId } from '../../src/types.ts'
import { withOTP, WithOTPOptions } from './main.ts'

export interface OTPManagerConfig {
  /**
   * Length of the OTP code.
   *
   * @default 6
   */
  length: number

  /**
   * Expiration of the token.
   *
   * @default "20m"
   */
  expiresIn: string | number

  /**
   * Number of wrong codes tolerated before the OTP is invalidated.
   * Without a limit, a short numeric code can be brute-forced
   * within its lifetime.
   */
  maximumFailedAttempts: number
}

export class OTPManager {
  static TOKEN_KIND = 'otp'

  constructor(
    private config: OTPManagerConfig,
    private tokens: TokenManager
  ) {}

  /**
   * Generates a one-time password for the given subject. Only the hash
   * is persisted, the returned value is the only copy of the code.
   */
  async generateOTP(tokenableId: RecordId, options: GenerateOTPOptions = {}) {
    const value = new Secret(this.randomOTP(options.length ?? this.config.length))

    await this.tokens.create(tokenableId, value, {
      kind: OTPManager.TOKEN_KIND,
      purpose: options.purpose,
      expiresIn: options.expiresIn || this.config.expiresIn,
      maximumFailedAttempts: options.maximumFailedAttempts ?? this.config.maximumFailedAttempts,
      metadata: options.metadata,
      hasher: 'scrypt',
    })

    return value
  }

  /**
   * Verifies a one-time password of the given subject and consumes it.
   * A wrong code counts as a failed attempt against every pending code
   * of the subject, codes reaching their maximum failed attempts count
   * are invalidated.
   *
   * @throws {E_TOO_MANY_ATTEMPTS} When the code is wrong and the OTP
   * reaches its maximum failed attempts count.
   * @throws {E_INVALID_TOKEN} When the code is unknown, expired, already
   * used or generated for a different purpose.
   */
  async verifyOTP(
    tokenableId: RecordId,
    value: Secret<string> | string,
    options: VerifyOTPOptions = {}
  ) {
    return this.tokens.verify(typeof value === 'string' ? new Secret(value) : value, {
      kind: OTPManager.TOKEN_KIND,
      purpose: options.purpose,
      tokenableId,
      hasher: 'scrypt',
    })
  }

  protected randomOTP(length: number) {
    if (!Number.isInteger(length) || length < 1) {
      throw new RangeError('length must be a positive integer')
    }

    const bytes = new Uint8Array(length)
    let otp = ''

    while (otp.length < length) {
      crypto.getRandomValues(bytes)
      for (const byte of bytes) {
        if (byte >= 250) continue // reject values that would bias the digits
        otp += byte % 10
        if (otp.length === length) break
      }
    }

    return otp
  }

  withOTP = (options: WithOTPOptions) => withOTP(this, options)
}
