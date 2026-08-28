import { createHash } from 'node:crypto'
import { Secret } from '@adonisjs/core/helpers'
import { test } from '@japa/runner'
import { MagicLinkManager, type MagicLinkManagerConfig } from '../../modules/magic_link/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { TokenManager } from '../../modules/token/manager.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import { createHashManager } from '../helpers.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'
import { MagicLinkManagerFactory } from '../../factories/magic_link.ts'

const LINK_URL = 'https://example.com/auth/magic-link'

const TWENTY_MINUTES = 20 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

/**
 * Manager holding the given configuration on top of the defaults. An
 * optional setting given as "undefined" is left unconfigured.
 */
function setup(config: Partial<MagicLinkManagerConfig> = {}) {
  const provider = new FakeMemoryTokenProvider()
  const tokens = new TokenManager(provider, createHashManager())

  const manager = new MagicLinkManagerFactory()
    .withTokens(tokens)
    .create({ expiresIn: '20m', url: LINK_URL, ...config })

  return { provider, tokens, manager }
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Extracts the token carried by a magic link.
 */
function tokenOf(link: Secret<string>) {
  return new URL(link.release()).searchParams.get('token')!
}

/**
 * Awaits a rejection with an "E_INVALID_TOKEN" error and returns it.
 */
async function invalidToken(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    if (error instanceof E_INVALID_TOKEN) return error
    throw error
  }

  throw new Error('Expected the magic link token to be rejected')
}

test.group('MagicLinkManager | generateMagicLinkToken', () => {
  test('should generate a random seed followed by its CRC32 checksum', async ({ assert }) => {
    const { manager } = setup()

    const token = await manager.generateMagicLinkToken(1)

    const match = token.release().match(/^([A-Za-z0-9_-]{40})(\d+)$/)
    assert.isNotNull(match)

    const [, seed, checksum] = match!
    assert.equal(Number(checksum), new CRC32().calculate(seed))
  })

  test('should generate a different token every time', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.generateMagicLinkToken(1)
    const second = await manager.generateMagicLinkToken(1)

    assert.notEqual(first.release(), second.release())
  })

  test('should persist the hash of the token with the magic link kind', async ({ assert }) => {
    const { manager, provider } = setup()

    const token = await manager.generateMagicLinkToken(1)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].tokenableId, 1)
    assert.equal(provider.tokens[0].hash, sha256(token.release()))
    assert.notEqual(provider.tokens[0].hash, token.release())
  })

  test('should generate a single use token without purpose nor metadata', async ({ assert }) => {
    const { manager, provider } = setup()

    await manager.generateMagicLinkToken(1)

    assert.equal(provider.tokens[0].maximumUsageCount, 1)
    assert.isNull(provider.tokens[0].maximumFailedAttemptsCount)
    assert.isNull(provider.tokens[0].purpose)
    assert.isNull(provider.tokens[0].metadata)
  })

  test('should apply the configured expiration', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '20m' })

    const before = Date.now()
    await manager.generateMagicLinkToken(1)
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + TWENTY_MINUTES)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + TWENTY_MINUTES)
  })

  test('should apply the given expiration over the configured one', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '20m' })

    const before = Date.now()
    await manager.generateMagicLinkToken(1, { expiresIn: '1h' })
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should apply the default expiration when none is configured', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: undefined })

    const before = Date.now()
    await manager.generateMagicLinkToken(1)
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + TWENTY_MINUTES)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + TWENTY_MINUTES)
  })

  test('should persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()

    await manager.generateMagicLinkToken('user-1', {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
    })

    assert.equal(provider.tokens[0].tokenableId, 'user-1')
    assert.equal(provider.tokens[0].purpose, 'signin')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
  })
})

test.group('MagicLinkManager | generateMagicLink', () => {
  test('should return the configured URL carrying the token', async ({ assert }) => {
    const { manager, provider } = setup()

    const link = await manager.generateMagicLink(1)

    assert.instanceOf(link, Secret)
    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, LINK_URL)
    assert.deepEqual([...url.searchParams.keys()], ['token'])
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].hash, sha256(tokenOf(link)))
  })

  test('should keep the search params of the URL and replace any token', async ({ assert }) => {
    const { manager, provider } = setup({ url: `${LINK_URL}?redirect=%2Fdashboard&token=stale` })

    const link = await manager.generateMagicLink(1)

    const url = new URL(link.release())
    assert.equal(url.searchParams.get('redirect'), '/dashboard')
    assert.deepEqual(url.searchParams.getAll('token'), [tokenOf(link)])
    assert.equal(provider.tokens[0].hash, sha256(tokenOf(link)))
  })

  test('should use the given URL over the configured one', async ({ assert }) => {
    const { manager } = setup()

    const link = await manager.generateMagicLink(1, { url: 'https://app.example.com/verify' })

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, 'https://app.example.com/verify')
    assert.isNotEmpty(url.searchParams.get('token'))
  })

  test('should forward the token options', async ({ assert }) => {
    const { manager, provider } = setup()

    const before = Date.now()
    await manager.generateMagicLink(1, {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
      expiresIn: '1h',
    })
    const after = Date.now()

    assert.equal(provider.tokens[0].purpose, 'signin')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should throw without persisting a token when the URL is invalid', async ({ assert }) => {
    const { manager, provider } = setup({ url: 'not-a-url' })

    await assert.rejects(() => manager.generateMagicLink(1), TypeError)
    assert.isEmpty(provider.tokens)
  })
})

test.group('MagicLinkManager | verifyMagicLinkToken', () => {
  test('should verify and consume the token', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1, {
      purpose: 'signin',
      metadata: { redirect: '/dashboard' },
    })

    const token = await manager.verifyMagicLinkToken(value, { purpose: 'signin' })

    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(token.usageCount, 1)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the token as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1)

    const token = await manager.verifyMagicLinkToken(value.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('should verify the token carried by a magic link', async ({ assert }) => {
    const { manager, provider } = setup()
    const link = await manager.generateMagicLink('user-1', { purpose: 'signin' })

    const token = await manager.verifyMagicLinkToken(tokenOf(link), { purpose: 'signin' })

    assert.equal(token.tokenableId, 'user-1')
    assert.isEmpty(provider.tokens)
  })

  test('should reject an unknown token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generateMagicLinkToken(1, { purpose: 'signin' })

    const error = await invalidToken(
      manager.verifyMagicLinkToken('unknown-token', { purpose: 'signin' })
    )

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('should reject a token generated for a different purpose')
    .with([
      { generated: 'signin', verified: undefined },
      { generated: 'signin', verified: 'signup' },
      { generated: undefined, verified: 'signin' },
    ])
    .run(async ({ assert }, { generated, verified }) => {
      const { manager, provider } = setup()
      const value = await manager.generateMagicLinkToken(1, { purpose: generated })

      const error = await invalidToken(manager.verifyMagicLinkToken(value, { purpose: verified }))

      assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
    })

  test('should reject a token that has already been used', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1)

    await manager.verifyMagicLinkToken(value)
    await invalidToken(manager.verifyMagicLinkToken(value))

    assert.isEmpty(provider.tokens)
  })

  test('should reject and invalidate an expired token', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generateMagicLinkToken(1)
    provider.tokens[0].expiresAt = new Date(Date.now() - 1_000)

    await invalidToken(manager.verifyMagicLinkToken(value))

    assert.isEmpty(provider.tokens)
  })

  test('should reject a token of a different kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('email-verification-token')
    await tokens.create(1, value, { kind: 'email_verification' })

    const error = await invalidToken(manager.verifyMagicLinkToken(value))

    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })
})
