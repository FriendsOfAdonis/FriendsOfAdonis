import { crc32 } from 'node:zlib'
import { Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'

/**
 * Creates the secret value of a token: a random seed followed by its
 * CRC32 checksum, so that secret scanning tools recognize the token,
 * the same way GitHub tokens carry one.
 *
 * @param size - The length of the random seed. Defaults to 40
 *
 * @see https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
 */
export function makeTokenValue(size: number = 40): Secret<string> {
  const seed = string.random(size)
  return new Secret(`${seed}${crc32(seed)}`)
}
