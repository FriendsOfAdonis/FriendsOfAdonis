import { test } from '@japa/runner'
import { Bouncer } from '@adonisjs/bouncer'
import { definePermissions, prefix } from '../src/define_permissions.ts'
import type { Access } from '../src/access.ts'
import type {
  ActivePermission,
  Grant,
  PermissionHolder,
  PermissionKey,
  RoleRow,
} from '../src/types.ts'
import { Member, permissions, Role, TeamMember, User } from './fixtures/models.ts'

const catalog = definePermissions(
  {
    product: {
      create: true,
      delete: { aliases: ['product.remove'] },
      archive: { inactive: true },
    },
  },
  prefix('admin', { user: { ban: 'Ban users' } })
)

test.group('Types', () => {
  test('infers every key as a literal union, including inactive keys', ({ expectTypeOf }) => {
    expectTypeOf<PermissionKey<typeof catalog>>().toEqualTypeOf<
      'product.create' | 'product.delete' | 'product.archive' | 'admin:user.ban'
    >()
    expectTypeOf(catalog.keys()).toEqualTypeOf<
      ('product.create' | 'product.delete' | 'product.archive' | 'admin:user.ban')[]
    >()
  })

  test('excludes inactive keys from the active keys', ({ expectTypeOf }) => {
    expectTypeOf<ActivePermission<typeof catalog>>().toEqualTypeOf<
      'product.create' | 'product.delete' | 'admin:user.ban'
    >()
    expectTypeOf(catalog.active()).toEqualTypeOf<
      ('product.create' | 'product.delete' | 'admin:user.ban')[]
    >()
    expectTypeOf(catalog.access([])).toEqualTypeOf<
      Access<'product.create' | 'product.delete' | 'admin:user.ban'>
    >()
  })

  test('accepts keys and wildcards as grants', ({ expectTypeOf }) => {
    expectTypeOf<Grant<typeof catalog>>().toEqualTypeOf<
      | 'product.create'
      | 'product.delete'
      | 'product.archive'
      | 'admin:user.ban'
      | '*'
      | 'product.*'
      | 'admin:*'
      | 'admin:user.*'
    >()
  })

  test('narrows unknown input with isGrant', ({ expectTypeOf }) => {
    const input: unknown = 'product.*'
    if (catalog.isGrant(input)) {
      expectTypeOf(input).toEqualTypeOf<Grant<typeof catalog>>()
    }
  })

  test('types the mixin writes and checks', ({ expectTypeOf }) => {
    const role = new Role()
    expectTypeOf(role.givePermission).parameter(0).toEqualTypeOf<Grant<typeof permissions>>()
    expectTypeOf<Awaited<ReturnType<Role['getPermissions']>>>().toEqualTypeOf<
      ActivePermission<typeof permissions>[]
    >()
    expectTypeOf(role.permissions).toEqualTypeOf<string[]>()

    const user = new User()
    expectTypeOf<Awaited<ReturnType<User['getRoles']>>>().toEqualTypeOf<Role[]>()
    expectTypeOf(user.hasPermission)
      .parameter(0)
      .toEqualTypeOf<ActivePermission<typeof permissions>>()
    expectTypeOf(user).toExtend<PermissionHolder>()
    expectTypeOf(new Member()).toExtend<PermissionHolder>()
    expectTypeOf(new TeamMember()).toExtend<PermissionHolder>()
    expectTypeOf(role).toExtend<RoleRow>()
  })

  test('rejects typos and inactive keys at compile time', () => {
    const role = new Role()
    const user = new User()

    /**
     * Never executed: the assertions are the compile errors.
     */
    const neverCalled = () => {
      // @ts-expect-error typo in the key
      void role.givePermission('product.craete')
      // @ts-expect-error aliases are read-only
      void role.givePermission('product.remove')
      // @ts-expect-error unknown resource wildcard
      void role.givePermission('order.*')
      // @ts-expect-error inactive keys cannot be checked
      void user.hasPermission('product.archive')
      // @ts-expect-error inactive keys cannot be checked
      catalog.access([]).allows('product.archive')
    }

    void neverCalled
  })

  test('generates Bouncer abilities for active keys only', ({ expectTypeOf }) => {
    const bouncer = new Bouncer(new User(), permissions.abilities())
    expectTypeOf<keyof ReturnType<typeof permissions.abilities>>().toEqualTypeOf<
      ActivePermission<typeof permissions>
    >()

    const neverCalled = async () => {
      await bouncer.authorize('product.create')
      await bouncer.authorize('admin:user.ban', ['*'])
      // @ts-expect-error inactive keys have no ability
      await bouncer.authorize('product.archive')
      // @ts-expect-error unknown ability
      await bouncer.authorize('product.craete')
    }

    void neverCalled
  })
})
