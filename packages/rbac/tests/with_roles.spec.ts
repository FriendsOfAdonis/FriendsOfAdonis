import { test } from '@japa/runner'
import { Bouncer } from '@adonisjs/bouncer'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { E_CONFLICTING_ROLE_MIXINS, E_UNKNOWN_ROLE } from '../src/errors.ts'
import { withRoleModel } from '../src/mixins/with_role_model.ts'
import { withRoles } from '../src/mixins/with_roles.ts'
import { Account, permissions, ReversedAccount, Role, roles } from './fixtures/models.ts'
import { setupDatabase } from './helpers.ts'

type Database = Awaited<ReturnType<typeof setupDatabase>>

/**
 * Returns the raw "roles" column of an account.
 */
async function storedRoles(database: Database, id: number): Promise<string | null> {
  const row = await database.db.from('accounts').where('id', id).firstOrFail()
  return row.roles
}

test.group('withRoles', (group) => {
  let database: Database

  group.each.setup(async () => {
    database = await setupDatabase()
    return () => database.close()
  })

  test('defaults the roles to an empty list on create', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })

    assert.deepEqual(account.roles, [])
    assert.equal(await storedRoles(database, account.id), '[]')
  })

  test('assigns roles by name and persists them', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    await account.assignRole('editor')
    await account.assignRoles(['billing_manager', 'editor'])

    assert.deepEqual(account.roles, ['editor', 'billing_manager'])
    assert.equal(await storedRoles(database, account.id), '["editor","billing_manager"]')

    const fresh = await Account.findOrFail(account.id)
    assert.deepEqual(fresh.getRoles(), ['editor', 'billing_manager'])
    assert.isTrue(fresh.hasRole('editor'))
    assert.isFalse(fresh.hasRole('admin'))
  })

  test('replaces every role on sync', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    await account.assignRoles(['editor', 'billing_manager'])
    await account.syncRoles(['admin', 'admin'])

    assert.deepEqual(account.roles, ['admin'])
    assert.equal(await storedRoles(database, account.id), '["admin"]')
  })

  test('revokes roles', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    await account.assignRoles(['editor', 'billing_manager', 'admin'])
    await account.revokeRole('editor')
    await account.revokeRoles(['admin', 'billing_manager'])

    assert.deepEqual(account.roles, [])
    assert.equal(await storedRoles(database, account.id), '[]')
  })

  test('rejects an unknown role without persisting anything', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    await account.assignRole('editor')

    const assign = account.assignRoles as (names: string[]) => Promise<void>
    await assert.rejects(
      () => assign.call(account, ['billing_manager', 'moderator']),
      E_UNKNOWN_ROLE
    )

    try {
      await assign.call(account, ['moderator'])
    } catch (error) {
      assert.equal((error as InstanceType<typeof E_UNKNOWN_ROLE>).value, 'moderator')
    }

    assert.deepEqual(account.roles, ['editor'])
    assert.equal(await storedRoles(database, account.id), '["editor"]')
  })

  test('ignores stored roles that are no longer defined', async ({ assert }) => {
    const [id] = await database.db
      .table('accounts')
      .insert({ email: 'virk@adonisjs.com', roles: '["moderator","editor"]', permissions: '[]' })
    const account = await Account.findOrFail(id)

    assert.deepEqual(account.getRoles(), ['editor'])
    assert.deepEqual(await account.getPermissions(), ['product.create', 'product.update'])
  })

  test('reads and writes a row that was never loaded', async ({ assert }) => {
    const fresh = new Account()
    assert.deepEqual(fresh.getRoles(), [])
    assert.deepEqual(await fresh.getPermissions(), [])

    const assigned = new Account()
    assigned.email = 'virk@adonisjs.com'
    await assigned.assignRole('editor')
    assert.equal(await storedRoles(database, assigned.id), '["editor"]')

    const withoutRole = new Account()
    withoutRole.email = 'romain@adonisjs.com'
    await withoutRole.revokeRole('editor')
    assert.equal(await storedRoles(database, withoutRole.id), '[]')

    const withoutPermission = new Account()
    withoutPermission.email = 'julien@adonisjs.com'
    await withoutPermission.revokePermission('product.create')
    assert.deepEqual(withoutPermission.permissions, [])
  })

  test('revokes stored roles that are no longer defined', async ({ assert }) => {
    const [id] = await database.db
      .table('accounts')
      .insert({ email: 'virk@adonisjs.com', roles: '["moderator","editor"]', permissions: '[]' })
    const account = await Account.findOrFail(id)

    await account.revokeRole('moderator')
    assert.deepEqual(account.roles, ['editor'])
    assert.equal(await storedRoles(database, account.id), '["editor"]')
  })

  test('consumes a null roles column as an empty list', async ({ assert }) => {
    const [id] = await database.db
      .table('accounts')
      .insert({ email: 'virk@adonisjs.com', roles: null, permissions: null })
    const account = await Account.findOrFail(id)

    assert.deepEqual(account.roles, [])
    assert.deepEqual(await account.getPermissions(), [])
  })

  test('merges the grants of roles and direct permissions in {$self}')
    .with([
      { title: 'composition order', Model: Account },
      { title: 'reverse composition order', Model: ReversedAccount },
    ] as const)
    .run(async ({ assert }, { Model }) => {
      const account = await Model.create({ email: 'virk@adonisjs.com' })
      await account.assignRole('editor')
      await account.givePermission('billing.*')

      assert.deepEqual(await account.getPermissions(), [
        'product.create',
        'product.update',
        'billing.refund',
      ])
      assert.isTrue(await account.hasPermission('billing.refund'))
      assert.isFalse(await account.hasPermission('admin.user.ban'))
    })

  test('expands the wildcards of a role', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    await account.assignRole('admin')

    assert.deepEqual(await account.getPermissions(), permissions.active())
  })

  test('refreshes the Bouncer grants of the instance after a change', async ({ assert }) => {
    const account = await Account.create({ email: 'virk@adonisjs.com' })
    const bouncer = new Bouncer(account, permissions.abilities())

    assert.isFalse(await bouncer.allows('product.create'))

    await account.assignRole('editor')
    assert.isTrue(await bouncer.allows('product.create'))

    await account.revokeRole('editor')
    assert.isFalse(await bouncer.allows('product.create'))
  })

  test('refuses to boot a model composing both role mixins in {$self}')
    .with(['composition order', 'reverse composition order'])
    .run(({ assert }, order) => {
      const fromCode = withRoles(roles)
      const fromModel = withRoleModel(permissions, { role: () => Role, pivotTable: 'user_roles' })

      const Model =
        order === 'composition order'
          ? class extends compose(BaseModel, fromCode, fromModel) {}
          : class extends compose(BaseModel, fromModel, fromCode) {}

      assert.throws(
        () => Model.boot(),
        'A model cannot use both "withRoles" and "withRoleModel". Pick roles defined in code or roles stored in the database'
      )

      try {
        Model.boot()
      } catch (error) {
        assert.instanceOf(error, E_CONFLICTING_ROLE_MIXINS)
      }
    })
})
