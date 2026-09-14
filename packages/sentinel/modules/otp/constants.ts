/**
 * Default number of digits of a code
 */
export const OTP_DEFAULT_LENGTH = 6

/**
 * Default lifetime of a code
 */
export const OTP_DEFAULT_EXPIRES_IN = '20m'

/**
 * Default number of failed attempts after which a code is
 * invalidated. Never unlimited, since a short numeric code is
 * brute-forced within its lifetime
 */
export const OTP_DEFAULT_MAXIMUM_FAILED_ATTEMPTS = 5
