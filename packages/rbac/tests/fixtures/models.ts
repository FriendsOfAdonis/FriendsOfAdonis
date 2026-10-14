import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { definePermissions } from '../../src/define_permissions.ts'
import { defineRoles } from '../../src/define_roles.ts'
import { withPermissions } from '../../src/mixins/with_permissions.ts'
import { withRoleModel } from '../../src/mixins/with_role_model.ts'
import { withRoles } from '../../src/mixins/with_roles.ts'

/**
 * Permissions shared by every model fixture.
 */
export const permissions = definePermissions(
  {
    product: {
      create: true,
      update: 'Update products',
      delete: 'Delete products',
      archive: 'Archive products',
    },
    billing: {
      refund: 'Issue refunds',
    },
    admin: {
      user: { ban: true, impersonate: 'Impersonate users' },
    },
  },
  {
    aliases: { 'product.remove': 'product.delete', 'backoffice': 'admin' },
    inactive: ['product.archive'],
  }
)

/**
 * Roles defined in code, shared by the code roles fixtures.
 */
export const roles = defineRoles(permissions, {
  editor: { description: 'Manages the catalog', permissions: ['product.create', 'product.update'] },
  billing_manager: { permissions: ['billing.refund'] },
  admin: { description: 'Full access', permissions: ['*'] },
})

/**
 * Role model storing grants in a JSON column.
 */
export class Role extends compose(BaseModel, withPermissions(permissions)) {
  static table = 'roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
}

/**
 * User with direct permissions applied first, then roles.
 */
export class User extends compose(
  BaseModel,
  withPermissions(permissions),
  withRoleModel(permissions, { role: () => Role, pivotTable: 'user_roles' })
) {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string
}

/**
 * Same as User with the mixins composed in the reverse order.
 */
export class Member extends compose(
  BaseModel,
  withRoleModel(permissions, {
    role: () => Role,
    pivotTable: 'member_roles',
    pivotForeignKey: 'member_id',
  }),
  withPermissions(permissions)
) {
  static table = 'members'

  @column({ isPrimary: true })
  declare id: number
}

/**
 * Per-team membership holding roles, with custom pivot columns.
 */
export class TeamMember extends compose(
  BaseModel,
  withRoleModel(permissions, {
    role: () => Role,
    pivotTable: 'team_member_roles',
    pivotForeignKey: 'membership_id',
    pivotRelatedForeignKey: 'granted_role_id',
  })
) {
  static table = 'team_members'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare teamId: number

  @column()
  declare userId: number
}

/**
 * Holder of roles declared in code, with direct permissions applied last.
 */
export class Account extends compose(BaseModel, withRoles(roles), withPermissions(permissions)) {
  static table = 'accounts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string
}

/**
 * Same as Account with the mixins composed in the reverse order.
 */
export class ReversedAccount extends compose(
  BaseModel,
  withPermissions(permissions),
  withRoles(roles)
) {
  static table = 'accounts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string
}
