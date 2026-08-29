import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Database } from '@adonisjs/lucid/database'
import { compose } from '@adonisjs/core/helpers'
import { PasswordManagerFactory } from '../../factories/password.ts'
import { TokenManagerFactory } from '../../factories/token.ts'
import type { PasswordManager } from '../../modules/password/manager.ts'
import type { WithPasswordOptions } from '../../modules/password/mixins/with_password.ts'
import { LucidTokenProvider } from '../../modules/token/providers/lucid.ts'
import { createDatabase, createTables } from '../helpers.ts'

/**
 * Returns the persisted tokens, oldest first
 */
function tokenRows(db: Database) {
  return db.from('sentinel_tokens').orderBy('id')
}

/**
 * Model composing the mixin. It has no password column, since the
 * reset tokens are the only concern of these tests.
 */
function setupModel(manager: PasswordManager, defaults: WithPasswordOptions = {}) {
  class User extends compose(BaseModel, manager.withPassword(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
}

/**
 * Manager persisting its tokens in the database, next to the users
 */
async function setup(defaults: WithPasswordOptions = {}) {
  const db = await createDatabase()
  await createTables(db)

  const tokens = new TokenManagerFactory().withProvider(new LucidTokenProvider(db)).create()
  const manager = new PasswordManagerFactory().withTokens(tokens).create()
  const User = setupModel(manager, defaults)
  const user = await User.create({ email: 'virk@adonisjs.com' })

  return { db, tokens, manager, User, user }
}

test.group('Password mixin | invalidatePasswordResetTokens', () => {
  test('invalidate the tokens without purpose by default', async ({ assert }) => {
    const { db, user } = await setup()
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['invite']
    )
  })

  test('inherit the default purpose of the mixin', async ({ assert }) => {
    const { db, user } = await setup({ purpose: 'invite' })
    await user.generatePasswordResetToken()
    await user.generatePasswordResetToken({ purpose: 'recovery' })
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens()

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['recovery']
    )
  })

  test('drop the default purpose when the purpose option is explicitly undefined', async ({
    assert,
  }) => {
    const { db, user } = await setup({ purpose: 'invite' })
    await user.generatePasswordResetToken({ purpose: undefined })
    await user.generatePasswordResetToken({ purpose: 'invite' })

    await user.invalidatePasswordResetTokens({ purpose: undefined })

    const rows = await tokenRows(db)
    assert.deepEqual(
      rows.map((row) => row.purpose),
      ['invite']
    )
  })
})
