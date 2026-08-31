/**
 * Exceptions raised by the sentinel modules
 */
export { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../modules/token/errors.ts'
export { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../modules/password/errors.ts'
export { E_INVALID_BACKUP_CODE, E_INVALID_TOTP, E_TOTP_LOCKED } from '../modules/totp/errors.ts'
