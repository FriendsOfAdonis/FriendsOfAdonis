/**
 * Default column holding the verified email address
 */
export const DEFAULT_EMAIL_COLUMN_NAME = 'email'

/**
 * Default column holding the address awaiting verification
 */
export const DEFAULT_UNVERIFIED_EMAIL_COLUMN_NAME = 'unverifiedEmail'

/**
 * Default column holding the timestamp of the verification
 */
export const DEFAULT_EMAIL_VERIFIED_AT_COLUMN_NAME = 'emailVerifiedAt'

/**
 * Default lifetime of an email verification token. Verification
 * emails routinely sit unread for hours, so the tokens live longer
 * than the other kinds.
 */
export const DEFAULT_EMAIL_EXPIRES_IN = '1d'
