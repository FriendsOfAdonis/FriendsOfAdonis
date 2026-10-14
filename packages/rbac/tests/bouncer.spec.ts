import { test } from '@japa/runner'
import { Bouncer, errors as bouncerErrors } from '@adonisjs/bouncer'
import { definePermissions } from '../src/define_permissions.ts'
import { cachedGrants, forgetGrants } from '../src/grants_cache.ts'
import { permissions, Role, TeamMember, User } from './fixtures/models.ts'
import { setupDatabase } from './helpers.ts'

type Database = Awaited<ReturnType<typeof setupDatabase>>

/**
 * Creates a user holding the editor role (product.create, product.update).
 */
async function createEditor() {
  const editor = await Role.create({ name: 'editor' })
  await editor.givePermissions(['product.create', 'product.update'])

  const user = await User.create({ email: 'virk@adonisjs.com' })
  await user.assignRole(editor)

  return { user, editor }
}

test.group('Bouncer abilities', (group) => {
  let database: Database

  group.each.setup(async () => {
    database = await setupDatabase()
    return () => database.close()
  })

  test('generates one ability per active key, built once', ({ assert }) => {
    const abilities = permissions.abilities()

    assert.deepEqual(Object.keys(abilities), [
      'product.create',
      'product.update',
      'product.delete',
      'billing.refund',
      'admin.user.ban',
      'admin.user.impersonate',
    ])
    assert.notProperty(abilities, 'product.archive')
    assert.strictEqual(permissions.abilities(), abilities)
    assert.isTrue(Object.isFrozen(abilities))
    assert.isFalse(abilities['product.create'].allowGuest)
  })

  test('allows and authorizes a granted permission', async ({ assert }) => {
    const { user } = await createEditor()
    const bouncer = new Bouncer(user, permissions.abilities())

    assert.isTrue(await bouncer.allows('product.create'))
    assert.isFalse(await bouncer.denies('product.update'))
    await assert.doesNotReject(() => bouncer.authorize('product.create'))
  })

  test('denies a missing permission with a 403', async ({ assert }) => {
    const { user } = await createEditor()
    const bouncer = new Bouncer(user, permissions.abilities())

    assert.isFalse(await bouncer.allows('product.delete'))
    assert.isTrue(await bouncer.denies('billing.refund'))

    try {
      await bouncer.authorize('product.delete')
      assert.fail('Expected the authorization to fail')
    } catch (error) {
      assert.instanceOf(error, bouncerErrors.E_AUTHORIZATION_FAILURE)
      assert.equal((error as { status: number }).status, 403)
    }
  })

  test('denies guests', async ({ assert }) => {
    const bouncer = new Bouncer<User, ReturnType<typeof permissions.abilities>>(
      () => null,
      permissions.abilities()
    )

    assert.isFalse(await bouncer.allows('product.create'))
    await assert.rejects(() => bouncer.authorize('product.create'), 'Access denied')
  })

  test('scopes the check with token abilities: {title}')
    .with([
      { title: 'explicit keys', scope: ['product.create'], create: true, update: false },
      { title: '["*"]', scope: ['*'], create: true, update: true },
      { title: 'resource wildcard', scope: ['product.*'], create: true, update: true },
      { title: 'other resource', scope: ['billing.*'], create: false, update: false },
      { title: 'empty scope', scope: [], create: false, update: false },
    ])
    .run(async ({ assert }, { scope, create, update }) => {
      const { user } = await createEditor()
      const bouncer = new Bouncer(user, permissions.abilities())

      assert.equal(await bouncer.allows('product.create', scope), create)
      assert.equal(await bouncer.allows('product.update', scope), update)
      assert.isFalse(await bouncer.allows('product.delete', ['*']))
    })

  test('uses the full permission set when the scope is undefined', async ({ assert }) => {
    const { user } = await createEditor()
    const bouncer = new Bouncer(user, permissions.abilities())
    const tokenAbilities: string[] | undefined = undefined

    assert.isTrue(await bouncer.allows('product.update', tokenAbilities))
  })

  test('has no ability for inactive keys', async ({ assert }) => {
    const role = await Role.create({ name: 'archiver' })
    await role.givePermissions(['product.archive', 'product.*'])
    const user = await User.create({ email: 'virk@adonisjs.com' })
    await user.assignRole(role)

    const bouncer = new Bouncer(user, permissions.abilities())
    const untyped = bouncer as unknown as { allows(ability: string): Promise<boolean> }

    await assert.rejects(
      () => untyped.allows('product.archive'),
      `Invalid bouncer ability "'product.archive'"`
    )
    assert.isTrue(await bouncer.allows('product.delete'))
  })

  test('authorizes a team member as the holder', async ({ assert }) => {
    const admin = await Role.create({ name: 'admin' })
    await admin.givePermission('admin.*')
    const member = await TeamMember.create({ teamId: 1, userId: 1 })
    await member.assignRole(admin)

    const bouncer = new Bouncer(member, permissions.abilities())

    assert.isTrue(await bouncer.allows('admin.user.ban'))
    assert.isFalse(await bouncer.allows('product.create'))
    assert.isFalse(await bouncer.allows('admin.user.ban', ['product.*']))
  })

  test('loads the grants once for several checks on the same user', async ({ assert }) => {
    const { user: created } = await createEditor()
    const user = await User.findOrFail(created.id)
    const bouncer = new Bouncer(user, permissions.abilities())

    const { result, queries } = await database.track(async () => [
      await bouncer.allows('product.create'),
      await bouncer.allows('product.update'),
      await bouncer.allows('product.delete'),
      await bouncer.allows('product.create', ['*']),
    ])

    assert.deepEqual(result, [true, true, false, true])
    assert.lengthOf(queries, 1)
    assert.include(queries[0].sql, '`user_roles`')
  })

  test('shares one load between concurrent checks', async ({ assert }) => {
    const { user: created } = await createEditor()
    const user = await User.findOrFail(created.id)
    const bouncer = new Bouncer(user, permissions.abilities())

    const { result, queries } = await database.track(() =>
      Promise.all([
        bouncer.allows('product.create'),
        bouncer.allows('billing.refund'),
        bouncer.allows('product.update'),
      ])
    )

    assert.deepEqual(result, [true, false, true])
    assert.lengthOf(queries, 1)
  })

  test('caches per holder instance', async ({ assert }) => {
    const { user: created } = await createEditor()
    const first = await User.findOrFail(created.id)
    const second = await User.findOrFail(created.id)

    const { queries } = await database.track(async () => {
      await new Bouncer(first, permissions.abilities()).allows('product.create')
      await new Bouncer(second, permissions.abilities()).allows('product.create')
      await new Bouncer(first, permissions.abilities()).allows('product.update')
    })

    assert.lengthOf(queries, 2)
  })

  test('forgets the cached grants after {title} on the same instance')
    .with([
      {
        title: 'assignRole',
        mutate: async (user: User) => {
          const billing = await Role.create({ name: 'billing' })
          await billing.givePermission('billing.refund')
          await user.assignRole(billing)
        },
        refund: true,
        create: true,
      },
      {
        title: 'syncRoles',
        mutate: (user: User) => user.syncRoles([]),
        refund: false,
        create: false,
      },
      {
        title: 'revokeRole',
        mutate: async (user: User) => user.revokeRole(await Role.findByOrFail('name', 'editor')),
        refund: false,
        create: false,
      },
      {
        title: 'givePermission',
        mutate: (user: User) => user.givePermission('billing.refund'),
        refund: true,
        create: true,
      },
      {
        title: 'syncPermissions',
        mutate: (user: User) => user.syncPermissions(['billing.*']),
        refund: true,
        create: true,
      },
    ])
    .run(async ({ assert }, { mutate, refund, create }) => {
      const { user: created } = await createEditor()
      const user = await User.findOrFail(created.id)
      const bouncer = new Bouncer(user, permissions.abilities())

      assert.isFalse(await bouncer.allows('billing.refund'))
      assert.isTrue(await bouncer.allows('product.create'))

      await mutate(user)

      assert.equal(await bouncer.allows('billing.refund'), refund)
      assert.equal(await bouncer.allows('product.create'), create)
    })

  test('forgets the cached grants after revokePermission on the same instance', async ({
    assert,
  }) => {
    const user = await User.create({ email: 'virk@adonisjs.com' })
    await user.givePermission('billing.refund')
    const bouncer = new Bouncer(user, permissions.abilities())

    assert.isTrue(await bouncer.allows('billing.refund'))
    await user.revokePermission('billing.refund')
    assert.isFalse(await bouncer.allows('billing.refund'))
  })

  test('keeps cached grants after a role-side change until forgetGrants', async ({ assert }) => {
    const { user: created, editor } = await createEditor()
    const user = await User.findOrFail(created.id)
    const bouncer = new Bouncer(user, permissions.abilities())

    assert.isFalse(await bouncer.allows('billing.refund'))

    await editor.givePermission('billing.refund')
    assert.isFalse(await bouncer.allows('billing.refund'))
    assert.isTrue(await user.hasPermission('billing.refund'))

    forgetGrants(user)
    assert.isTrue(await bouncer.allows('billing.refund'))
  })
})

test.group('Grants cache', () => {
  test('does not cache a failed load', async ({ assert }) => {
    let calls = 0
    const holder = {
      async getGrants() {
        calls++
        if (calls === 1) {
          throw new Error('connection lost')
        }
        return ['billing.refund']
      },
    }

    const catalog = definePermissions({ billing: { refund: true } })
    const bouncer = new Bouncer(holder, catalog.abilities())

    await assert.rejects(() => bouncer.allows('billing.refund'), 'connection lost')
    assert.isTrue(await bouncer.allows('billing.refund'))
    assert.isTrue(await bouncer.allows('billing.refund'))
    assert.equal(calls, 2)
  })

  test('returns the same pending load until forgotten', async ({ assert }) => {
    let calls = 0
    const holder = {
      async getGrants() {
        calls++
        return [`call.${calls}`]
      },
    }

    const first = cachedGrants(holder)
    assert.strictEqual(cachedGrants(holder), first)
    assert.deepEqual(await first, ['call.1'])

    forgetGrants(holder)
    assert.deepEqual(await cachedGrants(holder), ['call.2'])
    assert.equal(calls, 2)
  })
})
