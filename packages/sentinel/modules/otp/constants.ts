/**
 * Number of digits of a code when the OTP module does not configure one.
 */
export const OTP_DEFAULT_LENGTH = 6

/**
 * Expiration of a code when the OTP module does not configure one.
 */
export const OTP_DEFAULT_EXPIRES_IN = '20m'

/**
 * Number of wrong codes tolerated when the OTP module does not
 * configure one. A short numeric code can be brute-forced within its
 * lifetime, it is therefore never left unlimited.
 */
export const OTP_DEFAULT_MAXIMUM_FAILED_ATTEMPTS = 5
