import { Exception } from '@adonisjs/core/exceptions'

/**
 * The "E_INVALID_TOKEN" exception is raised when a token cannot be
 * verified, because it is unknown, expired, already used or was
 * created for another purpose.
 *
 * The "error.kind" and "error.purpose" properties can be used to know
 * which token was expected.
 */
export const E_INVALID_TOKEN = class InvalidTokenException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_TOKEN'
  static message = 'The provided token is either invalid or expired.'

  /**
   * The kind of the expected token, for example "otp" or
   * "magic_link"
   */
  public kind: string

  /**
   * The purpose the expected token was created with, if any
   */
  public purpose?: string

  constructor(kind: string, purpose?: string) {
    super()
    this.kind = kind
    this.purpose = purpose
  }
}

/**
 * The "E_TOO_MANY_ATTEMPTS" exception is raised when a token reached
 * its maximum number of failed attempts and has been invalidated.
 *
 * It extends "E_INVALID_TOKEN", so that a handler catching invalid
 * tokens catches lockouts as well.
 */
export const E_TOO_MANY_ATTEMPTS = class TooManyAttemptsException extends E_INVALID_TOKEN {
  static status: number = 429
  static code = 'E_TOO_MANY_ATTEMPTS'
  static message = 'Too many failed attempts, the token has been invalidated.'
}
