import { Exception } from '@adonisjs/core/exceptions'
import type { DateTime } from 'luxon'

/**
 * Raised when the code given to "verifyBackupCode" matches none of the
 * backup codes left on the authenticator.
 */
export const E_INVALID_BACKUP_CODE = class InvalidBackupCodeException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_BACKUP_CODE'
  static message = 'The provided backup code is invalid.'
}

export const E_INVALID_OTP = class InvalidOTPException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_OTP'
  static message = 'The provided OTP code is invalid.'
}

/**
 * Raised when a wrong code locks an authenticator by reaching its maximum
 * failed verifications count, or targets an authenticator that is still
 * locked.
 */
export const E_TOTP_LOCKED = class TOTPLockedException extends Exception {
  static status: number = 429
  static code = 'E_TOTP_LOCKED'
  static message = 'Too many failed verifications, the authenticator is locked.'

  /**
   * Moment the authenticator accepts codes again.
   */
  public lockedUntil: DateTime

  constructor(lockedUntil: DateTime) {
    super()
    this.lockedUntil = lockedUntil
  }

  /**
   * Seconds left before the lock is lifted, ready for a "Retry-After"
   * header.
   */
  get retryAfter() {
    return Math.max(0, Math.ceil(this.lockedUntil.diffNow('seconds').seconds))
  }
}
