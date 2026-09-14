import { createHash } from 'node:crypto'
import { crc32 } from 'node:zlib'
import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { HashManagerFactory } from '@adonisjs/core/factories/hash'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import { PasswordManagerFactory } from '../../factories/password.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { PasswordManager, type PasswordManagerConfig } from '../../modules/password/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'
import { SentinelToken } from '../../modules/token/token.ts'
import { freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>

const NOW = new Date('2026-01-01T10:00:00.000Z')

/**
 * A hash computed by the scrypt hasher of "@adonisjs/hash"
 */
const SCRYPT_HASH = /^\$scrypt\$/

/**
 * A random seed of 40 characters followed by its CRC32 checksum
 */
const TOKEN = /^([A-Za-z0-9_-]{40})(\d{1,10})$/

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Scrypt hasher computing hashes with a lower cost than the default
 * one, as an outdated "config/hash.ts" would have
 */
function outdatedHasher() {
  return new HashManagerFactory({
    default: 'scrypt',
    list: { scrypt: () => new Scrypt({ cost: 4096 }) },
  })
    .create()
    .use('scrypt')
}

/**
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup(config: PasswordManagerConfig = {}) {
  const provider = new FakeMemoryTokenProvider()
  const hash = new HashManagerFactory().create().use('scrypt')
  const tokens = new TokenManagerFactory().withProvider(provider).create()
  const manager = new PasswordManagerFactory().withTokens(tokens).withHash(hash).create(config)

  return { provider, hash, tokens, manager }
}

test.group('Password manager | hashPassword', () => {
  test('hash the password with the hasher of the manager', async ({ assert }) => {
    const { manager } = setup()
    const hashed = await manager.hashPassword('secret')

    assert.match(hashed, SCRYPT_HASH)
    assert.notInclude(hashed, 'secret')
    assert.isTrue(await manager.verifyPassword(hashed, 'secret'))
  })

  test('salt the hashes, never hashing a password the same way twice', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.hashPassword('secret')
    const second = await manager.hashPassword('secret')

    assert.notEqual(first, second)
    assert.isTrue(await manager.verifyPassword(first, 'secret'))
    assert.isTrue(await manager.verifyPassword(second, 'secret'))
  })
})

test.group('Password manager | verifyPassword', () => {
  test('accept the right password', async ({ assert }) => {
    const { manager } = setup()
    const hashed = await manager.hashPassword('secret')

    assert.isTrue(await manager.verifyPassword(hashed, 'secret'))
  })

  test('refuse a wrong password', async ({ assert }) => {
    const { manager } = setup()
    const hashed = await manager.hashPassword('secret')

    assert.isFalse(await manager.verifyPassword(hashed, 'nope'))
  })

  test('accept a hash made with other options', async ({ assert }) => {
    const { manager } = setup()

    /**
     * The options live inside the hash itself, so a hash computed
     * before "config/hash.ts" changed still verifies
     */
    const hashed = await outdatedHasher().make('secret')

    assert.isTrue(await manager.verifyPassword(hashed, 'secret'))
    assert.isFalse(await manager.verifyPassword(hashed, 'nope'))
  })
})

test.group('Password manager | needsRehash', () => {
  test('report a fresh hash as up to date', async ({ assert }) => {
    const { manager } = setup()
    const hashed = await manager.hashPassword('secret')

    assert.isFalse(manager.needsRehash(hashed))
  })

  test('report a hash made with outdated options', async ({ assert }) => {
    const { manager } = setup()
    const hashed = await outdatedHasher().make('secret')

    assert.isTrue(manager.needsRehash(hashed))
  })
})

test.group('Password manager | generatePasswordResetToken', () => {
  test('create a random seed followed by its CRC32 checksum', async ({ assert }) => {
    const { manager } = setup()
    const token = await manager.generatePasswordResetToken(1)

    assert.instanceOf(token, Secret)

    const match = token.release().match(TOKEN)
    assert.isNotNull(match)

    const [, seed, checksum] = match!
    assert.equal(Number(checksum), crc32(seed))
  })

  test('create a different token every time', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.generatePasswordResetToken(1)
    const second = await manager.generatePasswordResetToken(1)

    assert.notEqual(first.release(), second.release())
  })

  test('persist the hash of the token only', async ({ assert }) => {
    const { manager, provider } = setup()
    const token = await manager.generatePasswordResetToken(1)

    assert.lengthOf(provider.tokens, 1)

    const [persisted] = provider.tokens
    assert.instanceOf(persisted, SentinelToken)
    assert.equal(persisted.tokenableId, 1)
    assert.equal(persisted.kind, 'password_reset')
    assert.equal(persisted.kind, PasswordManager.TOKEN_KIND)
    assert.equal(persisted.hash, sha256(token.release()))
    assert.notInclude(JSON.stringify(persisted), token.release())
  })

  test('create a single use token that never locks', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)

    const [token] = provider.tokens
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.isNull(token.maximumFailedAttemptsCount)
    assert.isNull(token.name)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
  })

  test('expire the token after 1 hour by default', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 60 * 60))
  })

  test('expire the token after the lifetime configured on the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '2h' })
    await manager.generatePasswordResetToken(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 2 * 60 * 60))
  })

  test('accept the lifetime in seconds', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: 90 })
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(2, { expiresIn: 30 })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 90))
    assert.deepEqual(provider.tokens[1].expiresAt, after(NOW, 30))
  })

  test('give precedence to the lifetime given at generation time', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '2h' })
    await manager.generatePasswordResetToken(1, { expiresIn: '5m' })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 5 * 60))
  })

  test('persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken('user-1', {
      purpose: 'invite',
      metadata: { redirect: '/dashboard' },
    })

    const [token] = provider.tokens
    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.purpose, 'invite')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })

  test('keep the previous tokens of the subject', async ({ assert }) => {
    const { manager, provider } = setup()

    /**
     * Unlike the OTP codes, the reset tokens are not replaced on
     * generation: requesting a reset twice keeps both emails usable
     */
    const first = await manager.generatePasswordResetToken(1)
    const second = await manager.generatePasswordResetToken(1)

    assert.lengthOf(provider.tokens, 2)
    assert.equal((await manager.verifyPasswordResetToken(first)).tokenableId, 1)
    assert.equal((await manager.verifyPasswordResetToken(second)).tokenableId, 1)
  })

  test('hide the token from the logs', async ({ assert }) => {
    const { manager } = setup()
    const token = await manager.generatePasswordResetToken(1)

    assert.notInclude(`${token}`, token.release())
    assert.notInclude(JSON.stringify({ token }), token.release())
  })
})

test.group('Password manager | verifyPasswordResetToken', () => {
  test('verify the token and consume it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1, {
      metadata: { redirect: '/dashboard' },
    })

    const token = await manager.verifyPasswordResetToken(value)

    assert.instanceOf(token, SentinelToken)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, PasswordManager.TOKEN_KIND)
    assert.equal(token.usageCount, 1)
    assert.isTrue(token.isExhausted())
    assert.deepEqual(token.lastUsedAt, NOW)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('accept the token as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    const token = await manager.verifyPasswordResetToken(value.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('verify the token against the purpose it was created for', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1, { purpose: 'invite' })

    const token = await manager.verifyPasswordResetToken(value, { purpose: 'invite' })

    assert.equal(token.purpose, 'invite')
    assert.isEmpty(provider.tokens)
  })

  test('accept the token until it expires', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    freezeTime(after(NOW, 60 * 60))
    const token = await manager.verifyPasswordResetToken(value)

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an expired token and remove it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    freezeTime(after(NOW, 60 * 60 + 1))
    await assert.rejects(() => manager.verifyPasswordResetToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an unknown token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1, { purpose: 'invite' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyPasswordResetToken('unknown-token', { purpose: 'invite' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.equal(error.purpose, 'invite')

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('refuse a token {mismatch}')
    .with([
      {
        mismatch: 'created with a purpose and verified without',
        created: 'invite',
        verified: undefined,
      },
      { mismatch: 'created for another purpose', created: 'invite', verified: 'recovery' },
      {
        mismatch: 'created without purpose and verified with one',
        created: undefined,
        verified: 'invite',
      },
    ])
    .run(async ({ assert }, { created, verified }) => {
      const { manager, provider } = setup()
      const value = await manager.generatePasswordResetToken(1, { purpose: created })

      const error = await rejection<InvalidTokenException>(() =>
        manager.verifyPasswordResetToken(value, { purpose: verified })
      )

      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.equal(error.kind, PasswordManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)

      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
    })

  test('refuse a token already used', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    await manager.verifyPasswordResetToken(value)
    await assert.rejects(() => manager.verifyPasswordResetToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a token of another kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('123456')
    await tokens.create(1, value, { kind: 'magic_link' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyPasswordResetToken(value)
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })
})

test.group('Password manager | invalidatePasswordResetTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invite' })
    await manager.generatePasswordResetToken(2)

    await manager.invalidatePasswordResetTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.purpose]),
      [
        [1, 'invite'],
        [2, null],
      ]
    )
  })

  test('invalidate the tokens of a purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invite' })
    await manager.generatePasswordResetToken(1, { purpose: 'recovery' })

    await manager.invalidatePasswordResetTokens(1, { purpose: 'invite' })

    assert.deepEqual(
      provider.tokens.map((token) => token.purpose),
      [null, 'recovery']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await tokens.create(1, new Secret('123456'), { kind: 'otp' })

    await manager.invalidatePasswordResetTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.kind),
      ['otp']
    )
  })
})

test.group('Password manager | invalidateAllPasswordResetTokens', () => {
  test('invalidate the tokens of every purpose', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invite' })
    await manager.generatePasswordResetToken(1, { purpose: 'recovery' })

    await manager.invalidateAllPasswordResetTokens(1)

    assert.isEmpty(provider.tokens)
  })

  test('leave the tokens of the other subjects and kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(2, { purpose: 'invite' })
    await tokens.create(1, new Secret('123456'), { kind: 'otp' })

    await manager.invalidateAllPasswordResetTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.kind]),
      [
        [2, 'password_reset'],
        [1, 'otp'],
      ]
    )
  })
})
