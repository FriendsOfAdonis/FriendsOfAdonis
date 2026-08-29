import { createHash } from 'node:crypto'
import { safeEqual } from '@adonisjs/core/helpers'
import type { Hash } from '@adonisjs/core/hash'
import type { TokenHasherContract } from './types.ts'

/**
 * Hashes tokens with SHA-256. The hash is deterministic, which allows
 * finding a token by its value.
 *
 * Use it with high-entropy secrets only, since a short numeric code
 * is brute-forced from its hash in milliseconds.
 */
export class Sha256TokenHasher implements TokenHasherContract {
  readonly deterministic = true

  /**
   * Returns the hex encoded SHA-256 hash of the value
   */
  async make(value: string) {
    return createHash('sha256').update(value).digest('hex')
  }

  /**
   * Verifies the value against the hash using a constant time
   * comparison
   */
  async verify(hash: string, value: string) {
    return safeEqual(hash, await this.make(value))
  }
}

/**
 * Hashes tokens with the scrypt hasher from "config/hash.ts". The
 * hash is salted, so a token cannot be found by its value and must
 * be found through its subject instead.
 *
 * Use it with the low-entropy codes a human types, like one-time
 * passwords.
 */
export class ScryptTokenHasher implements TokenHasherContract {
  readonly deterministic = false

  constructor(protected hash: Hash) {}

  /**
   * Returns the scrypt hash of the value
   */
  make(value: string) {
    return this.hash.make(value)
  }

  /**
   * Verifies the value against the hash
   */
  verify(hash: string, value: string) {
    return this.hash.verify(hash, value)
  }
}
