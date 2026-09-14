import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { ScryptTokenHasher, Sha256TokenHasher } from '../../modules/token/hashers.ts'

/**
 * A hash computed by the scrypt hasher of "@adonisjs/hash"
 */
const SCRYPT_HASH = /^\$scrypt\$/

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Scrypt token hasher backed by the scrypt hasher of a default hash
 * manager
 */
function createScryptHasher() {
  const hash = new HashManagerFactory<never>().create().use('scrypt')
  return { hash, hasher: new ScryptTokenHasher(hash) }
}

test.group('Token hashers | sha256', () => {
  test('hash the value with SHA-256, hex encoded', async ({ assert }) => {
    const hasher = new Sha256TokenHasher()
    const hash = await hasher.make('secret')

    assert.match(hash, /^[0-9a-f]{64}$/)
    assert.equal(hash, sha256('secret'))
  })

  test('hash a value to the same hash every time, so that a token can be found by its value', async ({
    assert,
  }) => {
    const hasher = new Sha256TokenHasher()

    assert.isTrue(hasher.deterministic)
    assert.equal(await hasher.make('secret'), await hasher.make('secret'))
  })

  test('verify the value against its hash', async ({ assert }) => {
    const hasher = new Sha256TokenHasher()
    const hash = await hasher.make('secret')

    assert.isTrue(await hasher.verify(hash, 'secret'))
  })

  test('refuse another value', async ({ assert }) => {
    const hasher = new Sha256TokenHasher()
    const hash = await hasher.make('secret')

    assert.isFalse(await hasher.verify(hash, 'Secret'))
    assert.isFalse(await hasher.verify(hash, 'secret '))
    assert.isFalse(await hasher.verify(hash, ''))
  })

  test('refuse a hash of another shape without throwing', async ({ assert }) => {
    const hasher = new Sha256TokenHasher()

    assert.isFalse(await hasher.verify('not-a-hash', 'secret'))
    assert.isFalse(await hasher.verify('', 'secret'))
  })
})

test.group('Token hashers | scrypt', () => {
  test('hash the value with the scrypt hasher of the hash manager', async ({ assert }) => {
    const { hash, hasher } = createScryptHasher()
    const hashed = await hasher.make('123456')

    assert.match(hashed, SCRYPT_HASH)
    assert.isTrue(await hash.verify(hashed, '123456'))
  })

  test('salt the hash, so that a token can only be found through its subject', async ({
    assert,
  }) => {
    const { hasher } = createScryptHasher()

    assert.isFalse(hasher.deterministic)
    assert.notEqual(await hasher.make('123456'), await hasher.make('123456'))
  })

  test('verify the value against its hash', async ({ assert }) => {
    const { hasher } = createScryptHasher()
    const hashed = await hasher.make('123456')

    assert.isTrue(await hasher.verify(hashed, '123456'))
  })

  test('refuse another value', async ({ assert }) => {
    const { hasher } = createScryptHasher()
    const hashed = await hasher.make('123456')

    assert.isFalse(await hasher.verify(hashed, '123457'))
    assert.isFalse(await hasher.verify(hashed, ''))
  })

  test('refuse a hash of another shape without throwing', async ({ assert }) => {
    const { hasher } = createScryptHasher()

    assert.isFalse(await hasher.verify(sha256('123456'), '123456'))
  })
})
