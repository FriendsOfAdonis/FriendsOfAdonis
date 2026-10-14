import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { E_CONFLICTING_ROLE_MIXINS, E_UNKNOWN_ROLE } from '../errors.ts'
import type { Roles } from '../roles.ts'
import type { WithRolesRow } from '../types.ts'
import { consumeList, parentGrants, prepareList, storeList, unique } from './utils.ts'

/**
 * Model class returned by the "withRoles" mixin.
 */
export type WithRolesModel<
  Model extends NormalizeConstructor<typeof BaseModel>,
  Name extends string,
  Active extends string,
> = Model & {
  new (...args: any[]): WithRolesRow<Name, Active>
}

/**
 * Returns the names when every one of them is a defined role.
 *
 * @throws {E_UNKNOWN_ROLE} When a name is not a defined role
 */
function assertRoles<Name extends string>(
  roles: Roles<Name, string, string, string>,
  names: Iterable<Name>
): Name[] {
  const values = [...names]
  for (const value of values) {
    if (!roles.isRole(value)) {
      throw new E_UNKNOWN_ROLE(value)
    }
  }

  return values
}

/**
 * Stores the names of roles declared in code (with "defineRoles") in a
 * JSON "roles" column of a Lucid model. The holder receives the grants
 * of every assigned role. Apply it to a user model, or to a team member
 * model for per-team roles.
 *
 * Writes are typed against the role names and validated at runtime.
 * Stored names no longer defined in code are ignored. For roles stored
 * in the database, use "withRoleModel" instead. A model uses one or the
 * other, never both.
 *
 * @example
 * export default class User extends compose(
 *   BaseModel,
 *   withRoles(roles),
 *   withPermissions(permissions)
 * ) {
 *   @column({ isPrimary: true })
 *   declare id: number
 * }
 *
 * await user.assignRole('editor')
 * await user.hasPermission('article.publish')
 */
export function withRoles<
  Name extends string,
  Key extends string,
  Active extends Key,
  Wildcard extends string,
>(roles: Roles<Name, Key, Active, Wildcard>) {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithRolesModel<Model, Name, Active> => {
    class WithRolesImpl extends superclass implements WithRolesRow<Name, Active> {
      /**
       * Registers the "roles" column and defaults it to an empty list
       * on create.
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

        if (this.$hasRelation('roles')) {
          throw new E_CONFLICTING_ROLE_MIXINS()
        }

        this.$addColumn('roles', {
          prepare: prepareList,
          consume: consumeList,
        })

        this.before('create', (row: WithRolesImpl) => {
          if (!Array.isArray(row.roles)) {
            row.roles = []
          }
        })
      }

      /**
       * Names of the roles stored on the row.
       */
      declare roles: string[]

      /**
       * Returns the assigned roles that are defined in code.
       */
      getRoles(): Name[] {
        return (this.roles ?? []).filter(roles.isRole)
      }

      /**
       * Returns whether the row has the role.
       */
      hasRole(name: Name): boolean {
        return this.getRoles().includes(name)
      }

      /**
       * Assigns a role and persists the row. Assigning an assigned role
       * is a no-op.
       *
       * @throws {E_UNKNOWN_ROLE} When the name is not a defined role
       */
      async assignRole(name: Name): Promise<void> {
        await this.assignRoles([name])
      }

      /**
       * Assigns several roles and persists the row. Assigned roles are
       * skipped.
       *
       * @throws {E_UNKNOWN_ROLE} When a name is not a defined role
       */
      async assignRoles(names: readonly Name[]): Promise<void> {
        const values = assertRoles(roles, names)
        await storeList(this, 'roles', unique([...(this.roles ?? []), ...values]))
      }

      /**
       * Replaces every assigned role and persists the row.
       *
       * @throws {E_UNKNOWN_ROLE} When a name is not a defined role
       */
      async syncRoles(names: readonly Name[]): Promise<void> {
        const values = assertRoles(roles, names)
        await storeList(this, 'roles', unique(values))
      }

      /**
       * Removes a role and persists the row. Removing a role that is not
       * assigned is a no-op. Accepts any name, so stored roles no longer
       * defined in code can be removed.
       */
      async revokeRole(name: Name | (string & {})): Promise<void> {
        await this.revokeRoles([name])
      }

      /**
       * Removes several roles and persists the row. Accepts any name, so
       * stored roles no longer defined in code can be removed.
       */
      async revokeRoles(names: readonly (Name | (string & {}))[]): Promise<void> {
        const revoked = new Set<string>(names)
        await storeList(
          this,
          'roles',
          (this.roles ?? []).filter((stored) => !revoked.has(stored))
        )
      }

      /**
       * Returns the grants of every assigned role, merged with the grants
       * of the class this mixin extends (for example direct permissions
       * from "withPermissions").
       */
      async getGrants(): Promise<string[]> {
        const inherited = await parentGrants(WithRolesImpl, this)
        return unique([...inherited, ...roles.grantsOf(this.roles ?? [])])
      }

      /**
       * Returns the resolved active permissions of the row.
       */
      async getPermissions(): Promise<Active[]> {
        return roles.permissions.resolve(await this.getGrants())
      }

      /**
       * Returns whether the row holds the given active permission.
       */
      async hasPermission(key: Active): Promise<boolean> {
        return (await this.getPermissions()).includes(key)
      }
    }

    return WithRolesImpl
  }
}
