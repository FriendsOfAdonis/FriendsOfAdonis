import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Shape of the "@adonisjs/session" store, which is not a dependency
 * of the package
 */
interface SessionLike {
  flashExcept(keys: string[]): void
  flash(key: string, value: unknown): void
  flashErrors(errors: Record<string, string>): void
}

/**
 * Shape of the "@adonisjs/i18n" translator, which is not a dependency
 * of the package
 */
interface I18nLike {
  t(identifier: string, data?: Record<string, unknown>, fallbackMessage?: string): string
}

/**
 * The "E_INVALID_CREDENTIALS" exception is raised when the uid or the
 * password given to "verifyCredentials" is wrong.
 *
 * It mirrors the exception of "@adonisjs/auth", code, status and
 * rendering alike, so that swapping "withAuthFinder" for
 * "withPassword" reports a failed login the same way.
 */
export const E_INVALID_CREDENTIALS = class InvalidCredentialsException extends Exception {
  static status: number = 400
  static code = 'E_INVALID_CREDENTIALS'
  static message = 'Invalid user credentials'

  /**
   * Translation identifier. Can be customized
   */
  identifier = 'errors.E_INVALID_CREDENTIALS'

  /**
   * Returns the message to be sent in the HTTP response. Feel free
   * to override this method and return a custom response.
   */
  getResponseMessage(error: this, ctx: HttpContext) {
    if ('i18n' in ctx) {
      return (ctx.i18n as I18nLike).t(error.identifier, {}, error.message)
    }

    return error.message
  }

  /**
   * Converts exception to an HTTP response
   */
  async handle(error: this, ctx: HttpContext) {
    const message = this.getResponseMessage(error, ctx)

    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'html':
      case null: {
        /**
         * Flash the error and redirect back when the session is
         * available, otherwise send the message as is
         */
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
 * The "E_INVALID_PASSWORD" exception is raised when the current
 * password given to "updatePassword" is wrong.
 */
export const E_INVALID_PASSWORD = class InvalidPasswordException extends Exception {
  static status: number = 400
  static code = 'E_INVALID_PASSWORD'
  static message = 'The current password is incorrect.'
}
