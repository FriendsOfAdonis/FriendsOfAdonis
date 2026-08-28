import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Session store of "@adonisjs/session", used to flash the error when
 * the package is installed.
 */
interface SessionLike {
  flashExcept(keys: string[]): void
  flash(key: string, value: unknown): void
  flashErrors(errors: Record<string, string>): void
}

/**
 * Translator of "@adonisjs/i18n", used to translate the response
 * message when the package is installed.
 */
interface I18nLike {
  t(identifier: string, data?: Record<string, unknown>, fallbackMessage?: string): string
}

/**
 * Raised when the credentials given to "verifyCredentials" do not match
 * any user. Mirrors the exception of "@adonisjs/auth" (same code, same
 * status, same rendering) so that replacing the "withAuthFinder" mixin
 * does not change how a failed login is reported.
 */
export const E_INVALID_CREDENTIALS = class InvalidCredentialsException extends Exception {
  static status: number = 400
  static code = 'E_INVALID_CREDENTIALS'
  static message = 'Invalid user credentials'

  /**
   * Translation identifier. Can be customized.
   */
  identifier = 'errors.E_INVALID_CREDENTIALS'

  /**
   * Returns the message to be sent in the HTTP response.
   */
  getResponseMessage(error: this, ctx: HttpContext) {
    if ('i18n' in ctx) {
      return (ctx.i18n as I18nLike).t(error.identifier, {}, error.message)
    }

    return error.message
  }

  /**
   * Converts the exception to an HTTP response.
   */
  async handle(error: this, ctx: HttpContext) {
    const message = this.getResponseMessage(error, ctx)

    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'html':
      case null: {
        const session = (ctx as { session?: SessionLike }).session

        if (session) {
          session.flashExcept(['_csrf', '_method', 'password', 'password_confirmation'])
          session.flash('error', message)
          session.flashErrors({ [error.code!]: message })
          ctx.response.redirect('back', true)
        } else {
          ctx.response.status(error.status).send(message)
        }
        break
      }
      case 'json':
        ctx.response.status(error.status).send({ errors: [{ message }] })
        break
      case 'application/vnd.api+json':
        ctx.response.status(error.status).send({ errors: [{ code: error.code, title: message }] })
        break
    }
  }
}

/**
 * Raised when the current password given to "updatePassword" does not
 * match the persisted one.
 */
export const E_INVALID_PASSWORD = class InvalidPasswordException extends Exception {
  static status: number = 400
  static code = 'E_INVALID_PASSWORD'
  static message = 'The current password is incorrect.'
}
