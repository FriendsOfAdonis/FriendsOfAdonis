import { Exception } from '@adonisjs/core/exceptions'

/**
 * The "E_EMAIL_ALREADY_VERIFIED" exception is raised when an email
 * verification token is requested for a row whose email is verified
 * and has no change pending, so there is nothing to verify.
 */
export const E_EMAIL_ALREADY_VERIFIED = class EmailAlreadyVerifiedException extends Exception {
  static status: number = 400
  static code = 'E_EMAIL_ALREADY_VERIFIED'
  static message = 'The email address is already verified.'
}
