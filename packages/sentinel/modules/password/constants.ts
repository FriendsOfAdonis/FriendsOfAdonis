/**
 * Model property holding the password when the "withPassword" mixin
 * does not specify one.
 */
export const DEFAULT_PASSWORD_COLUMN_NAME = 'password'

/**
 * Columns a user can be looked up by when the "withPassword" mixin
 * does not specify any.
 */
export const DEFAULT_PASSWORD_UIDS = ['email']

/**
 * Expiration of a password reset token when the password module does
 * not configure one.
 */
export const DEFAULT_PASSWORD_EXPIRES_IN = '1h'
