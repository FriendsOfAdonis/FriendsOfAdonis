import { Exception } from '@adonisjs/core/exceptions'
import type { DateTime } from 'luxon'

/**
 * The "E_INVALID_BACKUP_CODE" exception is raised when a backup code
 * matches none of the remaining codes of the authenticator.
 */
export const E_INVALID_BACKUP_CODE = class InvalidBackupCodeException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_BACKUP_CODE'
  static message = 'The provided backup code is invalid.'
}

/**
 * The "E_INVALID_OTP" exception is raised when a code does not match
 * the current time step of the authenticator, or has been accepted
 * already.
 */
export const E_INVALID_OTP = class InvalidOTPException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_OTP'
  static message = 'The provided OTP code is invalid.'
}

/**
 * The "E_TOTP_LOCKED" exception is raised when the authenticator has
 * been locked after too many failed verifications.
 *
 * The "error.lockedUntil" property can be used to know when the lock
 * lifts.
 */
export const E_TOTP_LOCKED = class TOTPLockedException extends Exception {
  static status: number = 429
  static code = 'E_TOTP_LOCKED'
  static message = 'Too many failed verifications, the authenticator is locked.'

  /**
   * Timestamp at which the lock lifts
   */
  public lockedUntil: DateTime

  constructor(lockedUntil: DateTime) {
    super()
    this.lockedUntil = lockedUntil
  }

  /**
   * Seconds left before the lock lifts, as expected by the
   * "Retry-After" header
   */
  get retryAfter() {
    return Math.max(0, Math.ceil(this.lockedUntil.diffNow('seconds').seconds))
  }
}
