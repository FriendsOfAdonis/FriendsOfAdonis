import type { TOTPAlgorithm } from './types.ts'

export const TOTP_DEFAULT_SECRET_LENGTH = 40

export const TOTP_DEFAULT_DIGITS = 6

export const TOTP_DEFAULT_PERIOD = 30

export const TOTP_DEFAULT_WINDOW = 1

export const TOTP_DEFAULT_ALGORITHM: TOTPAlgorithm = 'SHA1'

export const TOTP_DEFAULT_BACKUP_CODES_COUNT = 10
export const TOTP_DEFAULT_BACKUP_CODES_LENGTH = 10

export const TOTP_DEFAULT_MAXIMUM_FAILED_VERIFICATIONS = 5
export const TOTP_DEFAULT_LOCK_DURATION = '15m'

export const TOTP_SECRET_PURPOSE = 'sentinel:totp_secret'

export const TOTP_BACKUP_CODES_PURPOSE = 'sentinel:totp_backup_codes'
