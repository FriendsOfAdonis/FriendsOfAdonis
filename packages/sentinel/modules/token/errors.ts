import { Exception } from '@adonisjs/core/exceptions'

export const E_INVALID_TOKEN = class InvalidTokenException extends Exception {
  static status: number = 401
  static code = 'E_INVALID_TOKEN'
  static message = 'The provided token is either invalid or expired.'

  public kind: string
  public purpose?: string

  constructor(kind: string, purpose?: string) {
    super()
    this.kind = kind
    this.purpose = purpose
  }
}

/**
 * Raised when a wrong value locks a token by reaching its maximum failed
 * attempts count, or targets a token that was already locked. Specializes
 * {@link E_INVALID_TOKEN} so handlers catching invalid tokens catch it too.
 */
export const E_TOO_MANY_ATTEMPTS = class TooManyAttemptsException extends E_INVALID_TOKEN {
  static status: number = 429
  static code = 'E_TOO_MANY_ATTEMPTS'
  static message = 'Too many failed attempts, the token has been invalidated.'
}
