import { RuntimeException } from '@adonisjs/core/exceptions'
import { compose, Secret } from '@adonisjs/core/helpers'
import type { ApplicationService } from '@adonisjs/core/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { MagicLinkManager } from '../../modules/magic_link/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { createSentinelApp, SENTINEL_CONFIG } from '../helpers.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'

const LINK_URL = SENTINEL_CONFIG.magicLink.url
const ONE_HOUR = 60 * 60 * 1000

/**
 * Model using the mixin with "signin" as the default purpose. The mixin
 * is handed over rather than imported because its module resolves the
 * sentinel service from the application booted at import time, see
 * "createSentinelApp".
 */
function defineUser(manager: MagicLinkManager) {
  class User extends compose(BaseModel, manager.withMagicLink({ purpose: 'signin' })) {
    static table = 'users'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
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

test.group('withMagicLink', (group) => {
  let app: ApplicationService
  let provider: FakeMemoryTokenProvider
  let User: ReturnType<typeof defineUser>

  group.setup(async () => {
    const sentinel = await createSentinelApp()
    app = sentinel.app
    provider = sentinel.provider

    User = defineUser(await app.container.make('sentinel.magic_link'))
  })

  group.each.teardown(async () => {
    provider.tokens = []
    await User.query().delete()
  })

  group.teardown(() => app.terminate())

  test('should generate a token for the primary key of the model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const token = await user.generateMagicLinkToken()

    assert.instanceOf(token, Secret)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].tokenableId, user.id)
    assert.equal(provider.tokens[0].kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].purpose, 'signin')
  })

  test('should override the defaults of the mixin with the given options', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const before = Date.now()
    await user.generateMagicLinkToken({
      purpose: 'signup',
      metadata: { redirect: '/dashboard' },
      expiresIn: '1h',
    })
    const after = Date.now()

    assert.equal(provider.tokens[0].purpose, 'signup')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should generate a magic link for the model', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const link = await user.generateMagicLink({ metadata: { redirect: '/dashboard' } })

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, LINK_URL)
    assert.equal(provider.tokens[0].tokenableId, user.id)
    assert.equal(provider.tokens[0].purpose, 'signin')

    const [found, metadata] = await User.verifyMagicLinkToken(url.searchParams.get('token')!)
    assert.equal(found.id, user.id)
    assert.deepEqual(metadata, { redirect: '/dashboard' })
  })

  test('should generate the magic link with the given URL', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })

    const link = await user.generateMagicLink({ url: 'https://app.example.com/verify' })

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, 'https://app.example.com/verify')
    assert.isNotEmpty(url.searchParams.get('token'))
  })

  test('should throw when the primary key is empty', async ({ assert }) => {
    const user = new User()
    const message =
      /^Cannot generate a magic link token for User \{.*\}: the primary key is empty$/s

    await assert.rejects(() => user.generateMagicLinkToken(), RuntimeException, message)
    await assert.rejects(() => user.generateMagicLink(), RuntimeException, message)
    assert.isEmpty(provider.tokens)
  })

  test('should verify the token and return the model instance', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const token = await user.generateMagicLinkToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyMagicLinkToken(token)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'jane@example.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the token as a string', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const token = await user.generateMagicLinkToken()

    const [found, metadata] = await User.verifyMagicLinkToken(token.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(provider.tokens)
  })

  test('should verify the token with the default purpose of the mixin', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const token = await user.generateMagicLinkToken({ purpose: 'signup' })

    const error = await invalidToken(User.verifyMagicLinkToken(token))
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)

    const [found] = await User.verifyMagicLinkToken(token, { purpose: 'signup' })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should drop the default purpose when the purpose option is undefined', async ({
    assert,
  }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const token = await user.generateMagicLinkToken({ purpose: undefined })
    assert.isNull(provider.tokens[0].purpose)

    const error = await invalidToken(User.verifyMagicLinkToken(token))
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(provider.tokens, 1)

    const [found] = await User.verifyMagicLinkToken(token, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(provider.tokens)
  })

  test('should reject an unknown token', async ({ assert }) => {
    const error = await invalidToken(User.verifyMagicLinkToken('unknown-token'))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
  })

  test('should reject the token when the model no longer exists', async ({ assert }) => {
    const user = await User.create({ email: 'jane@example.com' })
    const token = await user.generateMagicLinkToken()
    await user.delete()

    const error = await invalidToken(User.verifyMagicLinkToken(token))

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(provider.tokens)
  })
})
