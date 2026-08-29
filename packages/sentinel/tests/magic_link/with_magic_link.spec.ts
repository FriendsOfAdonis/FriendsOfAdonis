import { createHash } from 'node:crypto'
import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Database } from '@adonisjs/lucid/database'
import { compose, Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { MagicLinkManagerFactory } from '../../factories/magic_link.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { MagicLinkManager, type MagicLinkManagerConfig } from '../../modules/magic_link/manager.ts'
import {
  withMagicLink,
  type WithMagicLinkOptions,
} from '../../modules/magic_link/mixins/with_magic_link.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { LucidTokenProvider } from '../../modules/token/providers/lucid.ts'
import { createDatabase, createTables, freezeTime, rejection } from '../helpers.ts'

type InvalidTokenException = InstanceType<typeof E_INVALID_TOKEN>

const LINK_URL = 'https://example.com/auth/magic-link'
const NOW = new Date('2026-01-01T10:00:00.000Z')

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
 * Returns the persisted tokens, oldest first
 */
function tokenRows(db: Database) {
  return db.from('sentinel_tokens').orderBy('id')
}

/**
 * Manager persisting its tokens in the database, next to the users
 */
function createManager(db: Database, config: Partial<MagicLinkManagerConfig> = {}) {
  const tokens = new TokenManagerFactory().withProvider(new LucidTokenProvider(db)).create()
  const manager = new MagicLinkManagerFactory()
    .withTokens(tokens)
    .create({ url: linkTo(LINK_URL), ...config })

  return { tokens, manager }
}

function setupModel(manager: MagicLinkManager, defaults: WithMagicLinkOptions = {}) {
  class User extends compose(BaseModel, manager.withMagicLink(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
}

async function setup(
  config: Partial<MagicLinkManagerConfig> = {},
  defaults: WithMagicLinkOptions = {}
) {
  const db = await createDatabase()
  await createTables(db)

  const { tokens, manager } = createManager(db, config)
  const User = setupModel(manager, defaults)
  const user = await User.create({ email: 'virk@adonisjs.com' })

  return { db, tokens, manager, User, user }
}

test.group('Magic link mixin | generateMagicLinkToken', () => {
  test('create a token for the primary key of the model', async ({ assert }) => {
    const { db, user } = await setup()
    const token = await user.generateMagicLinkToken()

    assert.instanceOf(token, Secret)

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(rows[0].hash, sha256(token.release()))
    assert.isNull(rows[0].purpose)
    assert.isNull(rows[0].metadata)
  })

  test('apply the defaults of the mixin over the config of the manager', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      { expiresIn: '20m' },
      { purpose: 'signin', expiresIn: '1h', metadata: { redirect: '/dashboard' } }
    )
    await user.generateMagicLinkToken()

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'signin')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/dashboard' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 60 * 60))
  })

  test('give precedence to the options given at creation time', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await setup(
      {},
      { purpose: 'signin', expiresIn: '1h', metadata: { redirect: '/dashboard' } }
    )
    await user.generateMagicLinkToken({
      purpose: 'signup',
      expiresIn: '5m',
      metadata: { redirect: '/welcome' },
    })

    const row = await db.from('sentinel_tokens').first()
    assert.equal(row.purpose, 'signup')
    assert.deepEqual(JSON.parse(row.metadata), { redirect: '/welcome' })
    assert.deepEqual(new Date(row.expires_at), after(NOW, 5 * 60))
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { db, User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.generateMagicLinkToken(),
      RuntimeException,
      /Cannot generate a magic link token for [\s\S]+: the primary key is empty/
    )
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Magic link mixin | generateMagicLink', () => {
  test('create a link for the primary key of the model', async ({ assert }) => {
    const { db, user } = await setup()
    const link = await user.generateMagicLink()

    assert.instanceOf(link, Secret)

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, LINK_URL)

    const rows = await tokenRows(db)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].hash, sha256(tokenOf(link)))
  })

  test('apply the defaults of the mixin over the config of the manager', async ({ assert }) => {
    const { db, user } = await setup(
      {},
      { url: linkTo('https://app.example.com/verify'), purpose: 'signin' }
    )
    const link = await user.generateMagicLink()

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, 'https://app.example.com/verify')
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'signin')
  })

  test('give precedence to the options given at creation time', async ({ assert }) => {
    const { db, user } = await setup(
      {},
      { url: linkTo('https://app.example.com/verify'), purpose: 'signin' }
    )
    const link = await user.generateMagicLink({
      url: linkTo('https://app.example.com/welcome'),
      purpose: 'signup',
    })

    const url = new URL(link.release())
    assert.equal(url.origin + url.pathname, 'https://app.example.com/welcome')
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'signup')
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { db, User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.generateMagicLink(),
      RuntimeException,
      /Cannot generate a magic link for [\s\S]+: the primary key is empty/
    )
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Magic link mixin | verifyMagicLinkToken', () => {
  test('return the model the token was created for along with the metadata', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generateMagicLinkToken({ metadata: { redirect: '/dashboard' } })

    const [found, metadata] = await User.verifyMagicLinkToken(token)

    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
    assert.equal(found.email, 'virk@adonisjs.com')
    assert.deepEqual(metadata, { redirect: '/dashboard' })
    assert.isEmpty(await tokenRows(db))
  })

  test('accept the token as a string', async ({ assert }) => {
    const { db, User, user } = await setup()
    const token = await user.generateMagicLinkToken()

    const [found, metadata] = await User.verifyMagicLinkToken(token.release())

    assert.equal(found.id, user.id)
    assert.isNull(metadata)
    assert.isEmpty(await tokenRows(db))
  })

  test('verify the token carried by a link', async ({ assert }) => {
    const { db, User, user } = await setup()
    const link = await user.generateMagicLink()

    const [found] = await User.verifyMagicLinkToken(tokenOf(link))

    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('verify the token against the default purpose of the mixin', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const token = await user.generateMagicLinkToken()

    const [found] = await User.verifyMagicLinkToken(token)

    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('give precedence to the purpose given at verification time', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const token = await user.generateMagicLinkToken({ purpose: 'signup' })

    const error = await rejection<InvalidTokenException>(() => User.verifyMagicLinkToken(token))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(await tokenRows(db), 1)

    const [found] = await User.verifyMagicLinkToken(token, { purpose: 'signup' })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const token = await user.generateMagicLinkToken({ purpose: undefined })
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const error = await rejection<InvalidTokenException>(() => User.verifyMagicLinkToken(token))
    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.purpose, 'signin')
    assert.lengthOf(await tokenRows(db), 1)

    const [found] = await User.verifyMagicLinkToken(token, { purpose: undefined })
    assert.equal(found.id, user.id)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse an unknown token', async ({ assert }) => {
    const { User } = await setup({}, { purpose: 'signin' })

    const error = await rejection<InvalidTokenException>(() =>
      User.verifyMagicLinkToken('unknown-token')
    )

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
  })

  test('refuse a token already used', async ({ assert }) => {
    const { User, user } = await setup()
    const token = await user.generateMagicLinkToken()

    await User.verifyMagicLinkToken(token)
    await assert.rejects(() => User.verifyMagicLinkToken(token), E_INVALID_TOKEN)
  })

  test('refuse an expired token', async ({ assert }) => {
    freezeTime(NOW)
    const { db, User, user } = await setup({ expiresIn: '20m' })
    const token = await user.generateMagicLinkToken()

    freezeTime(after(NOW, 20 * 60 + 1))
    await assert.rejects(() => User.verifyMagicLinkToken(token), E_INVALID_TOKEN)
    assert.isEmpty(await tokenRows(db))
  })

  test('refuse the token once the model no longer exists', async ({ assert }) => {
    const { db, User, user } = await setup({}, { purpose: 'signin' })
    const token = await user.generateMagicLinkToken()
    await user.delete()

    const error = await rejection<InvalidTokenException>(() => User.verifyMagicLinkToken(token))

    assert.instanceOf(error, E_INVALID_TOKEN)
    assert.equal(error.kind, MagicLinkManager.TOKEN_KIND)
    assert.equal(error.purpose, 'signin')
    assert.isEmpty(await tokenRows(db))
  })
})

test.group('Magic link mixin | invalidateMagicLinkTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { db, User, user } = await setup()
    const other = await User.create({ email: 'romain@adonisjs.com' })

    const plain = await user.generateMagicLinkToken()
    const signin = await user.generateMagicLinkToken({ purpose: 'signin' })
    const foreign = await other.generateMagicLinkToken()

    await user.invalidateMagicLinkTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => [row.tokenable_id, row.purpose]),
      [
        [user.id, 'signin'],
        [other.id, null],
      ]
    )

    await assert.rejects(() => User.verifyMagicLinkToken(plain), E_INVALID_TOKEN)

    const [self] = await User.verifyMagicLinkToken(signin, { purpose: 'signin' })
    assert.equal(self.id, user.id)

    const [found] = await User.verifyMagicLinkToken(foreign)
    assert.equal(found.id, other.id)
  })

  test('invalidate the tokens of a purpose only', async ({ assert }) => {
    const { db, user } = await setup()
    await user.generateMagicLinkToken()
    await user.generateMagicLinkToken({ purpose: 'signin' })
    await user.generateMagicLinkToken({ purpose: 'signup' })

    await user.invalidateMagicLinkTokens({ purpose: 'signin' })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      [null, 'signup']
    )
  })

  test('inherit the default purpose of the mixin', async ({ assert }) => {
    const { db, user } = await setup({}, { purpose: 'signin' })
    await user.generateMagicLinkToken()
    await user.generateMagicLinkToken({ purpose: 'signup' })
    await user.generateMagicLinkToken({ purpose: 'signin' })

    await user.invalidateMagicLinkTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['signup']
    )
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, user } = await setup({}, { purpose: 'signin' })
    await user.generateMagicLinkToken({ purpose: undefined })
    await user.generateMagicLinkToken({ purpose: 'signin' })

    await user.invalidateMagicLinkTokens({ purpose: undefined })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['signin']
    )
  })

  test('leave the tokens of the other kinds untouched', async ({ assert }) => {
    const { db, tokens, user } = await setup()
    await user.generateMagicLinkToken()
    await tokens.create(user.id, new Secret('123456'), { kind: 'otp' })

    await user.invalidateMagicLinkTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.kind),
      ['otp']
    )
  })

  test('refuse a model without primary key', async ({ assert }) => {
    const { User } = await setup()
    const user = new User()

    await assert.rejects(
      () => user.invalidateMagicLinkTokens(),
      RuntimeException,
      /Cannot invalidate the magic link tokens of [\s\S]+: the primary key is empty/
    )
  })
})

test.group('Magic link mixin | apply', () => {
  test('apply the mixin through the manager without defaults', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, manager.withMagicLink()) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    const token = await user.generateMagicLinkToken()
    assert.isNull((await db.from('sentinel_tokens').first()).purpose)

    const [found] = await User.verifyMagicLinkToken(token)
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })

  test('apply the mixin standalone with a manager', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)
    const { manager } = createManager(db)

    class User extends compose(BaseModel, withMagicLink(manager, { purpose: 'signin' })) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare email: string
    }

    const user = await User.create({ email: 'virk@adonisjs.com' })
    const token = await user.generateMagicLinkToken()
    assert.equal((await db.from('sentinel_tokens').first()).purpose, 'signin')

    const [found] = await User.verifyMagicLinkToken(token)
    assert.instanceOf(found, User)
    assert.equal(found.id, user.id)
  })
})
