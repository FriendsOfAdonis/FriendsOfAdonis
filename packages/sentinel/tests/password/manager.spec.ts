import { createHash } from 'node:crypto'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import { Secret } from '@adonisjs/core/helpers'
import { test } from '@japa/runner'
import { PasswordManager, type PasswordManagerConfig } from '../../modules/password/manager.ts'
import { E_INVALID_TOKEN } from '../../modules/token/errors.ts'
import { TokenManager } from '../../modules/token/manager.ts'
import { CRC32 } from '../../src/utils/crc32.ts'
import { createHashManager, MemoryTokenProvider } from '../helpers.ts'

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

function setup(config: Partial<PasswordManagerConfig> = {}) {
  const provider = new MemoryTokenProvider()
  const hash = createHashManager({
    scrypt: () => new Scrypt({}),
    weak: () => new Scrypt({ cost: 2048 }),
  })
  const tokens = new TokenManager(provider, hash)
  const manager = new PasswordManager({ expiresIn: '1h', ...config }, tokens, hash)

  return { provider, tokens, manager, hash }
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
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

  throw new Error('Expected the password reset token to be rejected')
}

test.group('PasswordManager | passwords', () => {
  test('should hash a password with the default hasher', async ({ assert }) => {
    const { manager, hash } = setup()

    const hashed = await manager.hashPassword('secret')

    assert.notEqual(hashed, 'secret')
    assert.isTrue(await hash.use('scrypt').verify(hashed, 'secret'))
    assert.isTrue(await manager.verifyPassword(hashed, 'secret'))
    assert.isFalse(await manager.verifyPassword(hashed, 'wrong'))
  })

  test('should salt every hash', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.hashPassword('secret')
    const second = await manager.hashPassword('secret')

    assert.notEqual(first, second)
    assert.isTrue(await manager.verifyPassword(second, 'secret'))
  })

  test('should hash a password with the configured hasher', async ({ assert }) => {
    const { manager, hash } = setup({ hasher: 'weak' })

    const hashed = await manager.hashPassword('secret')

    assert.isTrue(await hash.use('weak').verify(hashed, 'secret'))
    assert.isFalse(manager.needsRehash(hashed))
  })

  test('should need a rehash for a hash of another hasher', async ({ assert }) => {
    const { manager, hash } = setup()

    const outdated = await hash.use('weak').make('secret')

    assert.isTrue(await manager.verifyPassword(outdated, 'secret'))
    assert.isTrue(manager.needsRehash(outdated))
    assert.isFalse(manager.needsRehash(await manager.hashPassword('secret')))
  })

  test('should throw when the configured hasher is unknown', async ({ assert }) => {
    assert.throws(
      () => setup({ hasher: 'argon' }),
      'Cannot hash passwords with "argon". Make sure a "argon" hasher is defined inside the "config/hash.ts" file'
    )
  })
})

test.group('PasswordManager | generatePasswordResetToken', () => {
  test('should generate a random seed followed by its CRC32 checksum', async ({ assert }) => {
    const { manager } = setup()

    const token = await manager.generatePasswordResetToken(1)

    const match = token.release().match(/^([A-Za-z0-9_-]{40})(\d+)$/)
    assert.isNotNull(match)

    const [, seed, checksum] = match!
    assert.equal(Number(checksum), new CRC32().calculate(seed))
  })

  test('should generate a different token every time', async ({ assert }) => {
    const { manager } = setup()

    const first = await manager.generatePasswordResetToken(1)
    const second = await manager.generatePasswordResetToken(1)

    assert.notEqual(first.release(), second.release())
  })

  test('should persist the hash of the token with the password reset kind', async ({ assert }) => {
    const { manager, provider } = setup()

    const token = await manager.generatePasswordResetToken(1)

    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].kind, PasswordManager.TOKEN_KIND)
    assert.equal(provider.tokens[0].tokenableId, 1)
    assert.equal(provider.tokens[0].hash, sha256(token.release()))
    assert.notEqual(provider.tokens[0].hash, token.release())
  })

  test('should generate a single use token without purpose nor metadata', async ({ assert }) => {
    const { manager, provider } = setup()

    await manager.generatePasswordResetToken(1)

    assert.equal(provider.tokens[0].maximumUsageCount, 1)
    assert.isNull(provider.tokens[0].maximumFailedAttemptsCount)
    assert.isNull(provider.tokens[0].purpose)
    assert.isNull(provider.tokens[0].metadata)
  })

  test('should apply the configured expiration', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '1h' })

    const before = Date.now()
    await manager.generatePasswordResetToken(1)
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_HOUR)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_HOUR)
  })

  test('should apply the given expiration over the configured one', async ({ assert }) => {
    const { manager, provider } = setup({ expiresIn: '1h' })

    const before = Date.now()
    await manager.generatePasswordResetToken(1, { expiresIn: '1d' })
    const after = Date.now()

    assert.isAtLeast(provider.tokens[0].expiresAt.getTime(), before + ONE_DAY)
    assert.isAtMost(provider.tokens[0].expiresAt.getTime(), after + ONE_DAY)
  })

  test('should persist the purpose and the metadata', async ({ assert }) => {
    const { manager, provider } = setup()

    await manager.generatePasswordResetToken('user-1', {
      purpose: 'invitation',
      metadata: { redirect: '/dashboard' },
    })

    assert.equal(provider.tokens[0].tokenableId, 'user-1')
    assert.equal(provider.tokens[0].purpose, 'invitation')
    assert.deepEqual(provider.tokens[0].metadata, { redirect: '/dashboard' })
  })
})

test.group('PasswordManager | verifyPasswordResetToken', () => {
  test('should verify and consume the token', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1, {
      purpose: 'invitation',
      metadata: { redirect: '/dashboard' },
    })

    const token = await manager.verifyPasswordResetToken(value, { purpose: 'invitation' })

    assert.equal(token.tokenableId, 1)
    assert.equal(token.kind, PasswordManager.TOKEN_KIND)
    assert.equal(token.usageCount, 1)
    assert.deepEqual(token.metadata, { redirect: '/dashboard' })
    assert.isEmpty(provider.tokens)
  })

  test('should accept the token as a string', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    const token = await manager.verifyPasswordResetToken(value.release())

    assert.equal(token.tokenableId, 1)
    assert.isEmpty(provider.tokens)
  })

  test('should reject an unknown token', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1, { purpose: 'invitation' })

    const error = await invalidToken(
      manager.verifyPasswordResetToken('unknown-token', { purpose: 'invitation' })
    )

    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.status, 401)
    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.equal(error.purpose, 'invitation')
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })

  test('should reject a token generated for a different purpose')
    .with([
      { generated: 'invitation', verified: undefined },
      { generated: 'invitation', verified: 'reset' },
      { generated: undefined, verified: 'invitation' },
    ])
    .run(async ({ assert }, { generated, verified }) => {
      const { manager, provider } = setup()
      const value = await manager.generatePasswordResetToken(1, { purpose: generated })

      const error = await invalidToken(
        manager.verifyPasswordResetToken(value, { purpose: verified })
      )

      assert.equal(error.kind, PasswordManager.TOKEN_KIND)
      assert.equal(error.purpose, verified)
      assert.lengthOf(provider.tokens, 1)
      assert.equal(provider.tokens[0].usageCount, 0)
    })

  test('should reject a token that has already been used', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)

    await manager.verifyPasswordResetToken(value)
    await invalidToken(manager.verifyPasswordResetToken(value))

    assert.isEmpty(provider.tokens)
  })

  test('should reject and invalidate an expired token', async ({ assert }) => {
    const { manager, provider } = setup()
    const value = await manager.generatePasswordResetToken(1)
    provider.tokens[0].expiresAt = new Date(Date.now() - 1_000)

    await invalidToken(manager.verifyPasswordResetToken(value))

    assert.isEmpty(provider.tokens)
  })

  test('should reject a token of a different kind', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    const value = new Secret('magic-link-token')
    await tokens.create(1, value, { kind: 'magic_link' })

    const error = await invalidToken(manager.verifyPasswordResetToken(value))

    assert.equal(error.kind, PasswordManager.TOKEN_KIND)
    assert.lengthOf(provider.tokens, 1)
    assert.equal(provider.tokens[0].usageCount, 0)
  })
})

test.group('PasswordManager | invalidatePasswordResetTokens', () => {
  test('should invalidate the tokens of the subject of every purpose', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invitation' })
    await manager.generatePasswordResetToken(2)

    await manager.invalidatePasswordResetTokens(1)

    assert.deepEqual(
      provider.tokens.map((t) => t.tokenableId),
      [2]
    )
  })

  test('should only invalidate the tokens of the given purpose', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invitation' })

    await manager.invalidatePasswordResetTokens(1, { purpose: 'invitation' })

    assert.deepEqual(
      provider.tokens.map((t) => t.purpose),
      [null]
    )
  })

  test('should only invalidate the tokens without purpose when given null', async ({ assert }) => {
    const { manager, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await manager.generatePasswordResetToken(1, { purpose: 'invitation' })

    await manager.invalidatePasswordResetTokens(1, { purpose: null })

    assert.deepEqual(
      provider.tokens.map((t) => t.purpose),
      ['invitation']
    )
  })

  test('should leave the tokens of other kinds untouched', async ({ assert }) => {
    const { manager, tokens, provider } = setup()
    await manager.generatePasswordResetToken(1)
    await tokens.create(1, new Secret('magic-link-token'), { kind: 'magic_link' })

    await manager.invalidatePasswordResetTokens(1)

    assert.deepEqual(
      provider.tokens.map((t) => t.kind),
      ['magic_link']
    )
  })
})
