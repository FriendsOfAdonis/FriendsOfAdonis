import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { PasswordManagerFactory } from '../../factories/password.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import { FakeMemoryTokenProvider } from '../../modules/token/providers/fake.ts'

/**
 * Manager keeping its tokens in memory, so that the tests can inspect
 * them
 */
function setup() {
  const provider = new FakeMemoryTokenProvider()
  const tokens = new TokenManagerFactory().withProvider(provider).create()
  const manager = new PasswordManagerFactory().withTokens(tokens).create()

  return { provider, tokens, manager }
}

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
