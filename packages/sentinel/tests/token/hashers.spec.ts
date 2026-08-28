import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { ScryptTokenHasher, Sha256TokenHasher } from '../../modules/token/hashers.ts'
import { createHashManager } from '../helpers.ts'

test.group('Sha256TokenHasher', () => {
  const hasher = new Sha256TokenHasher()

  test('should be deterministic', ({ assert }) => {
    assert.isTrue(hasher.deterministic)
  })

  test('should hash the value with sha256', async ({ assert }) => {
    assert.equal(await hasher.make('secret'), createHash('sha256').update('secret').digest('hex'))
  })

  test('should produce the same hash for the same value', async ({ assert }) => {
    assert.equal(await hasher.make('secret'), await hasher.make('secret'))
    assert.notEqual(await hasher.make('secret'), await hasher.make('other'))
  })

  test('should verify a value against its hash', async ({ assert }) => {
    const hash = await hasher.make('secret')

    assert.isTrue(await hasher.verify(hash, 'secret'))
  })

  test('should reject a value that does not match the hash', async ({ assert }) => {
    const hash = await hasher.make('secret')

    assert.isFalse(await hasher.verify(hash, 'other'))
    assert.isFalse(await hasher.verify('not-a-hash', 'secret'))
  })
})

test.group('ScryptTokenHasher', () => {
  const hasher = new ScryptTokenHasher(createHashManager().use('scrypt'))

  test('should not be deterministic', ({ assert }) => {
    assert.isFalse(hasher.deterministic)
  })

  test('should produce a different hash for the same value', async ({ assert }) => {
    assert.notEqual(await hasher.make('secret'), await hasher.make('secret'))
  })

  test('should verify a value against its hash', async ({ assert }) => {
    const hash = await hasher.make('secret')

    assert.isTrue(await hasher.verify(hash, 'secret'))
  })

  test('should reject a value that does not match the hash', async ({ assert }) => {
    const hash = await hasher.make('secret')

    assert.isFalse(await hasher.verify(hash, 'other'))
  })
})
