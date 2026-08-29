import { randomBytes } from 'node:crypto'

/**
 * Crockford base32 alphabet used for the backup codes. It leaves out
 * I, L, O and U, so that no character reads as 1, l or 0 and no code
 * spells a word
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/**
 * RFC 4648 base32 alphabet, the encoding the authenticator apps
 * expect for the secret
 */
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Generates a random backup code, split in two halves by a dash
 *
 * @param length - The number of characters, separator aside
 */
export function generateBackupCode(length = 10) {
  const bytes = randomBytes(length)
  let code = ''
  for (const b of bytes) code += ALPHABET[b & 31]
  return `${code.slice(0, 5)}-${code.slice(5)}`
}

/**
 * Generates a list of random backup codes
 *
 * @param count - The number of codes
 * @param length - The number of characters of a code, separator aside
 */
export function generateBackupCodes(count: number, length = 10) {
  return Array.from({ length: count }, () => generateBackupCode(length))
}

/**
 * Normalizes a backup code typed by a user, ignoring the case, the
 * separator and any whitespace
 */
export function normalizeBackupCode(code: string) {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
}

/**
 * Encodes bytes as base32, without the "=" padding the authenticator
 * apps do not expect
 */
export function base32Encode(bytes: Uint8Array) {
  let bits = 0
  let value = 0
  let encoded = ''

  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      encoded += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) encoded += BASE32_ALPHABET[(value << (5 - bits)) & 31]

  return encoded
}

/**
 * Generates a random base32 encoded secret
 *
 * @param length - The number of random bytes. The encoded secret is
 * longer
 */
export function generateSecret(length: number) {
  return base32Encode(randomBytes(length))
}
