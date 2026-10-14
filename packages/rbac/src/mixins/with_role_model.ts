import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type {
  ManyToMany,
  ManyToManyClientContract,
  ManyToManyRelationContract,
} from '@adonisjs/lucid/types/relations'
import { forgetGrants } from '../grants_cache.ts'
import type { Permissions } from '../permissions.ts'
import type {
  RoleModel,
  RoleReference,
  RoleRow,
  WithRoleModelOptions,
  WithRoleModelRow,
} from '../types.ts'
import { parentGrants, unique } from './utils.ts'

/**
 * Model class returned by the "withRoleModel" mixin.
 */
export type WithRoleModelClass<
  Model extends NormalizeConstructor<typeof BaseModel>,
  Role extends RoleModel,
  Active extends string,
> = Model & {
  new (...args: any[]): WithRoleModelRow<Role, Active>
}

/**
 * Returns the query client of the "roles" relationship of a row.
 *
 * Lucid types "related()" through "ExtractModelRelations<this>", which
 * TypeScript cannot evaluate inside the generic mixin class, hence the
 * cast to the shape the relationship is registered with.
 */
function rolesClient(
  row: LucidRow
): ManyToManyClientContract<ManyToManyRelationContract<LucidModel, LucidModel>, LucidModel> {
  return (
    row as unknown as {
      related(
        name: 'roles'
      ): ManyToManyClientContract<ManyToManyRelationContract<LucidModel, LucidModel>, LucidModel>
    }
  ).related('roles')
}

/**
 * Returns the primary key value of a role reference.
 */
function roleId(role: RoleRow | number | string): number | string {
  return typeof role === 'object' ? role.$primaryKeyValue! : role
}

/**
 * Unsets the preloaded roles, so the next read queries them again, and
 * forgets the grants cached for Bouncer.
 */
function invalidate(row: LucidRow): void {
  delete row.$preloaded.roles
  forgetGrants(row)
}

/**
 * Connects a Lucid model to roles stored in the database, through a
 * pivot table. The holder receives the grants of every assigned role.
 * Apply it to a user model, or to a team member model for per-team
 * roles. For roles declared in code, use "withRoles" instead. A model
 * uses one or the other, never both.
 *
 * The role model must expose a "name" column and the "withPermissions"
 * mixin (or any "getGrants" method).
 *
 * @example
 * export default class User extends compose(
 *   BaseModel,
 *   withRoleModel(permissions, { role: () => Role, pivotTable: 'user_roles' })
 * ) {
 *   @column({ isPrimary: true })
 *   declare id: number
 * }
 *
 * await user.assignRole(editor)
 * await user.hasPermission('article.create')
 */
export function withRoleModel<
  Key extends string,
  Active extends Key,
  Wildcard extends string,
  Role extends RoleModel,
>(permissions: Permissions<Key, Active, Wildcard>, options: WithRoleModelOptions<Role>) {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithRoleModelClass<Model, Role, Active> => {
    class WithRoleModelImpl extends superclass implements WithRoleModelRow<Role, Active> {
      /**
       * Registers the "roles" many to many relationship.
       */
      static boot() {
        /**
         * Lucid sets "booted" on each model class, so an inherited value
         * means a parent was booted, not this class.
         */
        if (Object.hasOwn(this, 'booted') && this.booted) {
          return
        }

        super.boot()

        this.$addRelation('roles', 'manyToMany', options.role, {
          pivotTable: options.pivotTable,
          pivotForeignKey: options.pivotForeignKey,
          pivotRelatedForeignKey: options.pivotRelatedForeignKey,
        })
      }

      /**
       * Many to many relationship with the role model.
       */
      declare roles: ManyToMany<Role>

      /**
       * Returns the roles of the row. Uses the preloaded relationship
       * when present, queries it otherwise.
       */
      async getRoles(): Promise<InstanceType<Role>[]> {
        if (this.$hasRelated('roles')) {
          return this.$getRelated('roles') as InstanceType<Role>[]
        }

        return (await rolesClient(this).query()) as InstanceType<Role>[]
      }

      /**
       * Returns whether the row has the role. A string is matched against
       * the role name, a row against its primary key.
       */
      async hasRole(role: string | InstanceType<Role>): Promise<boolean> {
        const roles: RoleRow[] = await this.getRoles()
        if (typeof role === 'string') {
          return roles.some((row) => row.name === role)
        }

        return roles.some((row) => row.$primaryKeyValue === role.$primaryKeyValue)
      }

      /**
       * Assigns a role. Assigning an already assigned role is a no-op.
       */
      async assignRole(role: RoleReference<Role>): Promise<void> {
        await this.assignRoles([role])
      }

      /**
       * Assigns several roles. Already assigned roles are skipped, so the
       * unique pivot constraint is never hit.
       */
      async assignRoles(roles: readonly RoleReference<Role>[]): Promise<void> {
        try {
          await rolesClient(this).sync(unique(roles.map(roleId)), false)
        } finally {
          invalidate(this)
        }
      }

      /**
       * Replaces every assigned role.
       */
      async syncRoles(roles: readonly RoleReference<Role>[]): Promise<void> {
        try {
          await rolesClient(this).sync(unique(roles.map(roleId)))
        } finally {
          invalidate(this)
        }
      }

      /**
       * Removes a role. Removing a role that is not assigned is a no-op.
       */
      async revokeRole(role: RoleReference<Role>): Promise<void> {
        await this.revokeRoles([role])
      }

      /**
       * Removes several roles. An empty list removes nothing.
       */
      async revokeRoles(roles: readonly RoleReference<Role>[]): Promise<void> {
        if (roles.length === 0) {
          return
        }

        try {
          await rolesClient(this).detach(unique(roles.map(roleId)))
        } finally {
          invalidate(this)
        }
      }

      /**
       * Returns the grants of every assigned role, merged with the grants
       * of the class this mixin extends (for example direct permissions
       * from "withPermissions").
       */
      async getGrants(): Promise<string[]> {
        const inherited = await parentGrants(WithRoleModelImpl, this)
        const roles: RoleRow[] = await this.getRoles()
        const fromRoles = await Promise.all(roles.map((role) => role.getGrants()))
        return unique([...inherited, ...fromRoles.flat()])
      }

      /**
       * Returns the resolved active permissions of the row.
       */
      async getPermissions(): Promise<Active[]> {
        return permissions.resolve(await this.getGrants())
      }

      /**
       * Returns whether the row holds the given active permission.
       */
      async hasPermission(key: Active): Promise<boolean> {
        return (await this.getPermissions()).includes(key)
      }
    }

    return WithRoleModelImpl
  }
}
