import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { definePermissions, prefix } from '../../src/define_permissions.ts'
import { withPermissions } from '../../src/mixins/with_permissions.ts'
import { withRoles } from '../../src/mixins/with_roles.ts'

/**
 * Permissions shared by every model fixture.
 */
export const permissions = definePermissions(
  {
    product: {
      create: true,
      update: 'Update products',
      delete: { description: 'Delete products', aliases: ['product.remove'] },
      archive: { description: 'Archive products', inactive: true },
    },
    billing: {
      refund: 'Issue refunds',
    },
  },
  prefix('admin', {
    user: { ban: true, impersonate: 'Impersonate users' },
  })
)

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
  withRoles(permissions, { role: () => Role, pivotTable: 'user_roles' })
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
  withRoles(permissions, {
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
  withRoles(permissions, {
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
