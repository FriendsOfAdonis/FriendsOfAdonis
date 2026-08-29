import type { TOTPAlgorithm } from './types.ts'

/**
 * Default length of a secret, in bytes
 */
export const TOTP_DEFAULT_SECRET_LENGTH = 40

/**
 * Default number of digits of a code
 */
export const TOTP_DEFAULT_DIGITS = 6

/**
 * Default duration of a time step, in seconds
 */
export const TOTP_DEFAULT_PERIOD = 30

/**
 * Default number of time steps accepted on either side of the
 * current one
 */
export const TOTP_DEFAULT_WINDOW = 1

/**
 * Default hashing algorithm. SHA1 is the one every authenticator
 * app supports
 */
export const TOTP_DEFAULT_ALGORITHM: TOTPAlgorithm = 'SHA1'

/**
 * Default number of backup codes and their length in characters
 */
export const TOTP_DEFAULT_BACKUP_CODES_COUNT = 10
export const TOTP_DEFAULT_BACKUP_CODES_LENGTH = 10

/**
 * Default number of consecutive failed verifications after which an
 * authenticator is locked, and the default duration of the lock
 */
export const TOTP_DEFAULT_MAXIMUM_FAILED_VERIFICATIONS = 5
export const TOTP_DEFAULT_LOCK_DURATION = '15m'

/**
 * Encryption purpose of the secrets, so that a payload encrypted for
 * another use cannot be decrypted as a secret
 */
export const TOTP_SECRET_PURPOSE = 'sentinel:totp_secret'

/**
 * Encryption purpose of the backup codes
 */
export const TOTP_BACKUP_CODES_PURPOSE = 'sentinel:totp_backup_codes'
