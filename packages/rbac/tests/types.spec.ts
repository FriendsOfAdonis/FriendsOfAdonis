import { test } from '@japa/runner'
import { Bouncer } from '@adonisjs/bouncer'
import { definePermissions } from '../src/define_permissions.ts'
import { defineRoles } from '../src/define_roles.ts'
import type { Access } from '../src/access.ts'
import type {
  ActivePermission,
  Grant,
  PermissionHolder,
  PermissionKey,
  RoleName,
  RoleRow,
} from '../src/types.ts'
import { Account, Member, permissions, Role, roles, TeamMember, User } from './fixtures/models.ts'

const catalog = definePermissions(
  {
    product: { create: true, delete: 'Delete products', archive: true },
    admin: { user: { ban: 'Ban users' }, team: { create: true } },
  },
  { aliases: { 'product.remove': 'product.delete' }, inactive: ['product.archive', 'admin.team'] }
)

test.group('Types', () => {
  test('infers every key as a literal union, including inactive keys', ({ expectTypeOf }) => {
    type Key =
      | 'product.create'
      | 'product.delete'
      | 'product.archive'
      | 'admin.user.ban'
      | 'admin.team.create'

    expectTypeOf<PermissionKey<typeof catalog>>().toEqualTypeOf<Key>()
    expectTypeOf(catalog.keys()).toEqualTypeOf<Key[]>()
  })

  test('excludes inactive keys and namespaces from the active keys', ({ expectTypeOf }) => {
    expectTypeOf<ActivePermission<typeof catalog>>().toEqualTypeOf<
      'product.create' | 'product.delete' | 'admin.user.ban'
    >()
    expectTypeOf(catalog.active()).toEqualTypeOf<
      ('product.create' | 'product.delete' | 'admin.user.ban')[]
    >()
    expectTypeOf(catalog.access([])).toEqualTypeOf<
      Access<'product.create' | 'product.delete' | 'admin.user.ban'>
    >()
  })

  test('accepts keys and wildcards as grants', ({ expectTypeOf }) => {
    expectTypeOf<Grant<typeof catalog>>().toEqualTypeOf<
      | 'product.create'
      | 'product.delete'
      | 'product.archive'
      | 'admin.user.ban'
      | 'admin.team.create'
      | '*'
      | 'product.*'
      | 'admin.*'
      | 'admin.user.*'
      | 'admin.team.*'
    >()
  })

  test('rejects unknown paths in the options', () => {
    /**
     * Never executed: the assertions are the compile errors.
     */
    const neverCalled = () => {
      // @ts-expect-error unknown inactive path
      definePermissions({ product: { create: true } }, { inactive: ['product.craete'] })
      // @ts-expect-error unknown alias target
      definePermissions({ product: { create: true } }, { aliases: { 'item.add': 'product.add' } })
      // @ts-expect-error actions cannot sit at the root
      definePermissions({ export: true })
    }

    void neverCalled
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
      // @ts-expect-error unknown namespace wildcard
      void role.givePermission('order.*')
      // @ts-expect-error wildcards only end a path
      void role.givePermission('admin.*.ban')
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
      await bouncer.authorize('admin.user.ban', ['*'])
      // @ts-expect-error inactive keys have no ability
      await bouncer.authorize('product.archive')
      // @ts-expect-error unknown ability
      await bouncer.authorize('product.craete')
    }

    void neverCalled
  })

  test('infers role names as a literal union', ({ expectTypeOf }) => {
    expectTypeOf<RoleName<typeof roles>>().toEqualTypeOf<'editor' | 'billing_manager' | 'admin'>()
    expectTypeOf(roles.names()).toEqualTypeOf<('editor' | 'billing_manager' | 'admin')[]>()
  })

  test('types the code roles mixin', ({ expectTypeOf }) => {
    const account = new Account()
    expectTypeOf(account.assignRole).parameter(0).toEqualTypeOf<RoleName<typeof roles>>()
    expectTypeOf(account.getRoles()).toEqualTypeOf<RoleName<typeof roles>[]>()
    expectTypeOf(account.roles).toEqualTypeOf<string[]>()
    expectTypeOf(account.hasPermission)
      .parameter(0)
      .toEqualTypeOf<ActivePermission<typeof permissions>>()
    expectTypeOf(account.givePermission).parameter(0).toEqualTypeOf<Grant<typeof permissions>>()
    expectTypeOf(account).toExtend<PermissionHolder>()
  })

  test('rejects unknown grants and role names at compile time', () => {
    const account = new Account()

    /**
     * Never executed: the assertions are the compile errors.
     */
    const neverCalled = () => {
      // @ts-expect-error typo in a role grant
      defineRoles(catalog, { editor: { permissions: ['product.craete'] } })
      // @ts-expect-error aliases cannot be granted by a role
      defineRoles(catalog, { editor: { permissions: ['product.remove'] } })
      // @ts-expect-error unknown role
      void account.assignRole('moderator')
      // @ts-expect-error unknown role
      account.hasRole('moderator')
    }

    void neverCalled
  })
})
