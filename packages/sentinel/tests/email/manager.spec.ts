import { createHash } from 'node:crypto'
import { crc32 } from 'node:zlib'
import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { EmailManagerFactory } from '../../factories/email.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { EmailManager, type EmailManagerConfig } from '../../modules/email/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'
import { SentinelToken } from '../../modules/token/token.ts'
import { freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>

const EMAIL = 'contact@friendsofadonis.com'
const NOW = new Date('2026-01-01T10:00:00.000Z')

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
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup(config: EmailManagerConfig = {}) {
  const provider = new FakeMemoryTokenProvider()
  const tokens = new TokenManagerFactory().withProvider(provider).create()
  const manager = new EmailManagerFactory().withTokens(tokens).create(config)

  return { provider, tokens, manager }
}

test.group('Email manager | generateEmailVerificationToken', () => {
  test('create a random seed followed by its CRC32 checksum', async ({ assert }) => {
    const { manager } = setup()
    const token = await manager.generateEmailVerificationToken(1, EMAIL)

    assert.instanceOf(token, Secret)

    const match = token.release().match(TOKEN)
    assert.isNotNull(match)

    const [, seed, checksum] = match!
    assert.equal(Number(checksum), crc32(seed))
  })

  test('create a different token every time', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.generateEmailVerificationToken(1, EMAIL)
    const second = await manager.generateEmailVerificationToken(1, EMAIL)

    assert.notEqual(first.release(), second.release())
  })

  test('persist the hash of the token only', async ({ assert }) => {
    const { manager, provider } = setup()
    const token = await manager.generateEmailVerificationToken(1, EMAIL)

    assert.lengthOf(provider.tokens, 1)

    const [persisted] = provider.tokens
    assert.instanceOf(persisted, SentinelToken)
    assert.equal(persisted.tokenableId, 1)
    assert.equal(persisted.kind, 'email_verification')
    assert.equal(persisted.kind, EmailManager.TOKEN_KIND)
    assert.equal(persisted.hash, sha256(token.release()))
    assert.notInclude(JSON.stringify(persisted), token.release())
  })

  test('persist the address the token verifies as its name', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)

    assert.equal(provider.tokens[0].name, EMAIL)
  })

  test('create a single use token that never locks', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)

    const [token] = provider.tokens
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.isNull(token.maximumFailedAttemptsCount)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
  })

  test('expire the token after one day by default', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 24 * 60 * 60))
  })

  test('expire the token after the lifetime configured on the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateEmailVerificationToken(1, EMAIL)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 60 * 60))
  })

  test('give precedence to the lifetime given at creation time', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateEmailVerificationToken(1, EMAIL, { expiresIn: '5m' })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 5 * 60))
  })

  test('persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken('user-1', EMAIL, {
      purpose: 'signup',
      metadata: { redirect: '/dashboard' },
    })

    const [token] = provider.tokens
    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.purpose, 'signup')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })
})

test.group('Email manager | verifyEmailVerificationToken', () => {
  test('verify the token and consume it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const value = await manager.generateEmailVerificationToken(1, EMAIL, {
      metadata: { redirect: '/dashboard' },
    })

    const token = await manager.verifyEmailVerificationToken(value)

    assert.instanceOf(token, SentinelToken)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, EmailManager.TOKEN_KIND)
    assert.equal(token.name, EMAIL)
    assert.equal(token.usageCount, 1)
    assert.isTrue(token.isExhausted())
    assert.deepEqual(token.lastUsedAt, NOW)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('accept the token as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateEmailVerificationToken(1, EMAIL)

    const token = await manager.verifyEmailVerificationToken(value.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('verify the token against the purpose it was created for', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'signup' })

    const token = await manager.verifyEmailVerificationToken(value, { purpose: 'signup' })

    assert.equal(token.purpose, 'signup')
    assert.isEmpty(provider.tokens)
  })

  test('refuse an expired token and remove it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    const value = await manager.generateEmailVerificationToken(1, EMAIL)

    freezeTime(after(NOW, 60 * 60 + 1))
    await assert.rejects(() => manager.verifyEmailVerificationToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an unknown token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'signup' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyEmailVerificationToken('unknown-token', { purpose: 'signup' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, EmailManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signup')

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('refuse a token already used', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateEmailVerificationToken(1, EMAIL)

    await manager.verifyEmailVerificationToken(value)
    await assert.rejects(() => manager.verifyEmailVerificationToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a token of another kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('123456')
    await tokens.create(1, value, { kind: 'otp' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyEmailVerificationToken(value)
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, EmailManager.TOKEN_KIND)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })
})

test.group('Email manager | invalidateEmailVerificationTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { manager, provider } = setup()
    const plain = await manager.generateEmailVerificationToken(1, EMAIL)
    const signup = await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'signup' })
    const foreign = await manager.generateEmailVerificationToken(2, 'romain@adonisjs.com')

    await manager.invalidateEmailVerificationTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.purpose]),
      [
        [1, 'signup'],
        [2, null],
      ]
    )

    await assert.rejects(() => manager.verifyEmailVerificationToken(plain), E_INVALID_TOKEN)
    assert.equal(
      (await manager.verifyEmailVerificationToken(signup, { purpose: 'signup' })).purpose,
      'signup'
    )
    assert.equal((await manager.verifyEmailVerificationToken(foreign)).tokenableId, 2)
  })

  test('invalidate the tokens of a purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)
    await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'signup' })
    await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'change' })

    await manager.invalidateEmailVerificationTokens(1, { purpose: 'signup' })

    assert.deepEqual(
      provider.tokens.map((token) => token.purpose),
      [null, 'change']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)
    await tokens.create(1, new Secret('123456'), { kind: 'otp' })

    await manager.invalidateEmailVerificationTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.kind),
      ['otp']
    )
  })
})

test.group('Email manager | invalidateAllEmailVerificationTokens', () => {
  test('invalidate the tokens whatever their purpose', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)
    await manager.generateEmailVerificationToken(1, EMAIL, { purpose: 'signup' })

    await manager.invalidateAllEmailVerificationTokens(1)

    assert.isEmpty(provider.tokens)
  })

  test('leave the tokens of the other kinds and subjects untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generateEmailVerificationToken(1, EMAIL)
    await manager.generateEmailVerificationToken(2, 'romain@adonisjs.com')
    await tokens.create(1, new Secret('123456'), { kind: 'otp' })

    await manager.invalidateAllEmailVerificationTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.kind]),
      [
        [2, EmailManager.TOKEN_KIND],
        [1, 'otp'],
      ]
    )
  })
})
