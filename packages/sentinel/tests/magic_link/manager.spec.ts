import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { MagicLinkManagerFactory } from '../../factories/magic_link.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { MagicLinkManager, type MagicLinkManagerConfig } from '../../modules/magic_link/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'
import { SentinelToken } from '../../modules/token/token.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import { freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>

const LINK_URL = 'https://example.com/auth/magic-link'
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
 * Extracts the token carried by a magic link
 */
function tokenOf(link: Secret<string>) {
  return new URL(link.release()).searchParams.get('token')!
}

/**
 * URL builder carrying the token as the "token" query parameter of
 * the given URL
 */
function linkTo(base: string) {
  return (token: string) => `${base}?token=${token}`
}

/**
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup(config: Partial<MagicLinkManagerConfig> = {}) {
  const provider = new FakeMemoryTokenProvider()
  const tokens = new TokenManagerFactory().withProvider(provider).create()
  const manager = new MagicLinkManagerFactory()
    .withTokens(tokens)
    .create({ url: linkTo(LINK_URL), ...config })

  return { provider, tokens, manager }
}

test.group('Magic link manager | generateMagicLinkToken', () => {
  test('create a random seed followed by its CRC32 checksum', async ({ assert }) => {
    const { manager } = setup()
    const token = await manager.generateMagicLinkToken(1)

    assert.instanceOf(token, Secret)

    const match = token.release().match(TOKEN)
    assert.isNotNull(match)

    const [, seed, checksum] = match!
    assert.equal(Number(checksum), new CRC32().calculate(seed))
  })

  test('create a different token every time', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.generateMagicLinkToken(1)
    const second = await manager.generateMagicLinkToken(1)

    assert.notEqual(first.release(), second.release())
  })

  test('persist the hash of the token only', async ({ assert }) => {
    const { manager, provider } = setup()
    const token = await manager.generateMagicLinkToken(1)

    assert.lengthOf(provider.tokens, 1)

    const [persisted] = provider.tokens
    assert.instanceOf(persisted, SentinelToken)
    assert.equal(persisted.tokenableId, 1)
    assert.equal(persisted.kind, 'magic_link')
    assert.equal(persisted.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(persisted.hash, sha256(token.release()))
    assert.notInclude(JSON.stringify(persisted), token.release())
  })

  test('create a single use token that never locks', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken(1)

    const [token] = provider.tokens
    assert.equal(token.usageCount, 0)
    assert.equal(token.maximumUsageCount, 1)
    assert.isNull(token.maximumFailedAttemptsCount)
    assert.isNull(token.name)
    assert.isNull(token.purpose)
    assert.isNull(token.metadata)
  })

  test('expire the token after 20 minutes by default', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 20 * 60))
  })

  test('expire the token after the lifetime configured on the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateMagicLinkToken(1)

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 60 * 60))
  })

  test('accept the lifetime in seconds', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: 90 })
    await manager.generateMagicLinkToken(1)
    await manager.generateMagicLinkToken(1, { expiresIn: 30 })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 90))
    assert.deepEqual(provider.tokens[1].expiresAt, after(NOW, 30))
  })

  test('give precedence to the lifetime given at creation time', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '1h' })
    await manager.generateMagicLinkToken(1, { expiresIn: '5m' })

    assert.deepEqual(provider.tokens[0].expiresAt, after(NOW, 5 * 60))
  })

  test('persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken('user-1', {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
    })

    const [token] = provider.tokens
    assert.equal(token.tokenableId, 'user-1')
    assert.equal(token.purpose, 'signin')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
  })
})

test.group('Magic link manager | generateMagicLink', () => {
  test('return the configured URL carrying the token', async ({ assert }) => {
    const { manager, provider } = setup()
    const link = await manager.generateMagicLink(1)

    assert.instanceOf(link, Secret)

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, LINK_URL)
    assert.deepEqual([...url.searchParams.keys()], ['token'])
    assert.match(tokenOf(link), TOKEN)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].tokenableId, 1)
    assert.equal(provider.tokens[0].hash, sha256(tokenOf(link)))
  })

  test('hand the token to the URL builder and return its result untouched', async ({ assert }) => {
    const calls: string[] = []
    let built = ''

    /**
     * The uppercase host would be lowercased by a normalization
     */
    const { manager, provider } = setup({
      url: (token) => {
        calls.push(token)
        return (built = `https://Example.com/verify?token=${token}`)
      },
    })
    const link = await manager.generateMagicLink(1)

    assert.lengthOf(calls, 1)
    assert.match(calls[0], TOKEN)
    assert.equal(link.release(), built)
    assert.equal(provider.tokens[0].hash, sha256(calls[0]))
  })

  test('give precedence to the URL given at creation time', async ({ assert }) => {
    const { manager } = setup()
    const link = await manager.generateMagicLink(1, {
      url: linkTo('https://app.example.com/verify'),
    })

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, 'https://app.example.com/verify')
    assert.match(tokenOf(link), TOKEN)
  })

  test('forward the options of the token', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    await manager.generateMagicLink(1, {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
      expiresIn: '1h',
    })

    const [token] = provider.tokens
    assert.equal(token.purpose, 'signin')
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.deepEqual(token.expiresAt, after(NOW, 60 * 60))
  })

  test('refuse a relative URL without creating a token', async ({ assert }) => {
    const { manager, provider } = setup({ url: (token) => `/auth/magic-link?token=${token}` })

    await assert.rejects(() => manager.generateMagicLink(1), TypeError)
    assert.isEmpty(provider.tokens)
  })

  test('hide the link from the logs', async ({ assert }) => {
    const { manager } = setup()
    const link = await manager.generateMagicLink(1)

    assert.notInclude(`${link}`, tokenOf(link))
    assert.notInclude(JSON.stringify({ link }), tokenOf(link))
  })
})

test.group('Magic link manager | verifyMagicLinkToken', () => {
  test('verify the token and consume it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1, { metadata: { redirect: '/dashboard' } })

    const token = await manager.verifyMagicLinkToken(value)

    assert.instanceOf(token, SentinelToken)
    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(token.usageCount, 1)
    assert.isTrue(token.isExhausted())
    assert.deepEqual(token.lastUsedAt, NOW)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('accept the token as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1)

    const token = await manager.verifyMagicLinkToken(value.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('verify the token carried by a link', async ({ assert }) => {
    const { manager, provider } = setup()
    const link = await manager.generateMagicLink('user-1')

    const token = await manager.verifyMagicLinkToken(tokenOf(link))

    assert.equal(token.tokenableId, 'user-1')
    assert.isEmpty(provider.tokens)
  })

  test('verify the token against the purpose it was created for', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1, { purpose: 'signin' })

    const token = await manager.verifyMagicLinkToken(value, { purpose: 'signin' })

    assert.equal(token.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })

  test('accept the token until it expires', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '20m' })
    const value = await manager.generateMagicLinkToken(1)

    freezeTime(after(NOW, 20 * 60))
    const token = await manager.verifyMagicLinkToken(value)

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an expired token and remove it', async ({ assert }) => {
    freezeTime(NOW)
    const { manager, provider } = setup({ expiresIn: '20m' })
    const value = await manager.generateMagicLinkToken(1)

    freezeTime(after(NOW, 20 * 60 + 1))
    await assert.rejects(() => manager.verifyMagicLinkToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse an unknown token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken(1, { purpose: 'signin' })

    const error = await rejection<InvalidTokenException>(() =>
      manager.verifyMagicLinkToken('unknown-token', { purpose: 'signin' })
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('refuse a token {mismatch}')
    .with([
      {
        mismatch: 'created with a purpose and verified without',
        created: 'signin',
        verified: undefined,
      },
      { mismatch: 'created for another purpose', created: 'signin', verified: 'signup' },
      {
        mismatch: 'created without purpose and verified with one',
        created: undefined,
        verified: 'signin',
      },
    ])
    .run(async ({ assert }, { created, verified }) => {
      const { manager, provider } = setup()
      const value = await manager.generateMagicLinkToken(1, { purpose: created })

      const error = await rejection<InvalidTokenException>(() =>
        manager.verifyMagicLinkToken(value, { purpose: verified })
      )

      assert.instanceOf(error, E_INVALID_TOKEN)
      assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)

      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
    })

  test('refuse a token already used', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1)

    await manager.verifyMagicLinkToken(value)
    await assert.rejects(() => manager.verifyMagicLinkToken(value), E_INVALID_TOKEN)
    assert.isEmpty(provider.tokens)
  })

  test('refuse a token of another kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('123456')
    await tokens.create(1, value, { kind: 'otp' })

    const error = await rejection<InvalidTokenException>(() => manager.verifyMagicLinkToken(value))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })
})

test.group('Magic link manager | invalidateMagicLinkTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { manager, provider } = setup()
    const plain = await manager.generateMagicLinkToken(1)
    const signin = await manager.generateMagicLinkToken(1, { purpose: 'signin' })
    const foreign = await manager.generateMagicLinkToken(2)

    await manager.invalidateMagicLinkTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => [token.tokenableId, token.purpose]),
      [
        [1, 'signin'],
        [2, null],
      ]
    )

    await assert.rejects(() => manager.verifyMagicLinkToken(plain), E_INVALID_TOKEN)
    assert.equal(
      (await manager.verifyMagicLinkToken(signin, { purpose: 'signin' })).purpose,
      'signin'
    )
    assert.equal((await manager.verifyMagicLinkToken(foreign)).tokenableId, 2)
  })

  test('invalidate the tokens of a purpose only', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken(1)
    await manager.generateMagicLinkToken(1, { purpose: 'signin' })
    await manager.generateMagicLinkToken(1, { purpose: 'signup' })

    await manager.invalidateMagicLinkTokens(1, { purpose: 'signin' })

    assert.deepEqual(
      provider.tokens.map((token) => token.purpose),
      [null, 'signup']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generateMagicLinkToken(1)
    await tokens.create(1, new Secret('123456'), { kind: 'otp' })

    await manager.invalidateMagicLinkTokens(1)

    assert.deepEqual(
      provider.tokens.map((token) => token.kind),
      ['otp']
    )
  })
})
