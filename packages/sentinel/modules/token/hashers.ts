import { createHash } from 'node:crypto'
import { safeEqual } from '@adonisjs/core/helpers'
import type { Hash } from '@adonisjs/core/hash'
import type { TokenHasherContract } from './types.ts'

/**
 * Deterministic SHA-256 hasher. Safe for high-entropy secrets only:
 * a low-entropy value (a 6 digits code) can be brute-forced from
 * its hash in milliseconds.
 */
export class Sha256TokenHasher implements TokenHasherContract {
  readonly deterministic = true

  async make(value: string) {
    return createHash('sha256').update(value).digest('hex')
  }

  async verify(hash: string, value: string) {
    return safeEqual(hash, await this.make(value))
  }
}

/**
 * Slow salted hasher backed by the `scrypt` hasher of the application
 * hash service. Produces a different hash for the same value every
 * time, so tokens cannot be looked up by their hash.
 */
export class ScryptTokenHasher implements TokenHasherContract {
  readonly deterministic = false

  constructor(protected hash: Hash) {}

  make(value: string) {
    return this.hash.make(value)
  }

  verify(hash: string, value: string) {
    return this.hash.verify(hash, value)
  }
}
