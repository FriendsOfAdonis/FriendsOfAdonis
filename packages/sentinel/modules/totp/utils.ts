import { randomBytes } from 'node:crypto'
import { AuthenticatorOptions, TOTPAlgorithm } from './types.ts'

// Crockford base32: no I, L, O, U — avoids 1/l/0/O confusion and accidental words
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

// RFC 4648 base32, the encoding the authenticator applications read
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function generateBackupCode(length = 10) {
  const bytes = randomBytes(length)
  let code = ''
  for (const b of bytes) code += ALPHABET[b & 31]
  return `${code.slice(0, 5)}-${code.slice(5)}`
}

export function generateBackupCodes(count: number, length = 10) {
  return Array.from({ length: count }, () => generateBackupCode(length))
}

/**
 * Canonical form used to compare a code typed by the user against a
 * stored one, ignoring the case and the grouping separator.
 */
export function normalizeBackupCode(code: string) {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
}

/**
 * Encodes bytes to base32 (RFC 4648), without the padding the
 * authenticator applications do not expect.
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
 * Generates a secret of "length" random bytes, encoded in the base32
 * form expected by the authenticator applications.
 */
export function generateSecret(length: number) {
  return base32Encode(randomBytes(length))
}

/**
 * Merges layers of authenticator options, from the least specific to
 * the most specific one. A layer leaving an option out never hides the
 * value of the previous ones.
 */
export function mergeAuthenticatorOptions(
  ...layers: (Partial<AuthenticatorOptions> | undefined)[]
): AuthenticatorOptions {
  const merged: Record<string, unknown> = {}

  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer ?? {})) {
      if (value !== undefined) merged[key] = value
    }
  }

  return merged as AuthenticatorOptions
}

export interface AuthenticatorUriOptions {
  issuer: string
  label: string
  secret: string
  algorithm: TOTPAlgorithm
  digits: number
  period: number
}
