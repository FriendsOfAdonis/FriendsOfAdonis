import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { Permissions } from '../permissions.ts'
import type { WithPermissionsRow } from '../types.ts'
import { assertGrants, consumeList, parentGrants, prepareList, storeList, unique } from './utils.ts'

/**
 * Model class returned by the "withPermissions" mixin.
 */
export type WithPermissionsModel<
  Model extends NormalizeConstructor<typeof BaseModel>,
  Writable extends string,
  Active extends string,
> = Model & {
  new (...args: any[]): WithPermissionsRow<Writable, Active>
}

/**
 * Stores grants (permission keys and wildcards) in a JSON "permissions"
 * column of a Lucid model. Apply it to a role model, or to any model
 * that needs direct permissions, such as a user.
 *
 * Writes are typed against the definition and validated at runtime.
 * Revoking a key removes that key and its stored aliases, but does not
 * narrow a stored wildcard: revoke the wildcard itself for that.
 *
 * @example
 * export default class Role extends compose(BaseModel, withPermissions(permissions)) {
 *   @column({ isPrimary: true })
 *   declare id: number
 *
 *   @column()
 *   declare name: string
 * }
 *
 * await role.givePermissions(['article.create', 'comment.*'])
 */
export function withPermissions<Key extends string, Active extends Key, Wildcard extends string>(
  permissions: Permissions<Key, Active, Wildcard>
) {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithPermissionsModel<Model, Key | Wildcard, Active> => {
    class WithPermissionsImpl
      extends superclass
      implements WithPermissionsRow<Key | Wildcard, Active>
    {
      /**
       * Registers the "permissions" column and defaults it to an empty
       * list on create.
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

        this.$addColumn('permissions', {
          prepare: prepareList,
          consume: consumeList,
        })

        this.before('create', (row: WithPermissionsImpl) => {
          if (!Array.isArray(row.permissions)) {
            row.permissions = []
          }
        })
      }

      /**
       * Grants stored directly on the row.
       */
      declare permissions: string[]

      /**
       * Returns the stored grants, merged with the grants of the class
       * this mixin extends (for example roles from "withRoles" or "withRoleModel").
       */
      async getGrants(): Promise<string[]> {
        const inherited = await parentGrants(WithPermissionsImpl, this)
        return unique([...inherited, ...(this.permissions ?? [])])
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

      /**
       * Adds a grant and persists the row. Adding a stored grant is a no-op.
       *
       * @throws {E_UNKNOWN_PERMISSION} When the grant is neither a defined key nor a valid wildcard
       */
      async givePermission(grant: Key | Wildcard): Promise<void> {
        await this.givePermissions([grant])
      }

      /**
       * Adds several grants and persists the row. Stored grants are skipped.
       *
       * @throws {E_UNKNOWN_PERMISSION} When a grant is neither a defined key nor a valid wildcard
       */
      async givePermissions(grants: readonly (Key | Wildcard)[]): Promise<void> {
        const values = assertGrants(permissions, grants)
        await storeList(this, 'permissions', unique([...(this.permissions ?? []), ...values]))
      }

      /**
       * Replaces every stored grant and persists the row.
       *
       * @throws {E_UNKNOWN_PERMISSION} When a grant is neither a defined key nor a valid wildcard
       */
      async syncPermissions(grants: readonly (Key | Wildcard)[]): Promise<void> {
        const values = assertGrants(permissions, grants)
        await storeList(this, 'permissions', unique(values))
      }

      /**
       * Removes a grant and its stored aliases, then persists the row.
       * Revoking a missing grant is a no-op.
       *
       * @throws {E_UNKNOWN_PERMISSION} When the grant is neither a defined key nor a valid wildcard
       */
      async revokePermission(grant: Key | Wildcard): Promise<void> {
        await this.revokePermissions([grant])
      }

      /**
       * Removes several grants and their stored aliases, then persists the
       * row. A stored wildcard is only removed by revoking that wildcard.
       *
       * @throws {E_UNKNOWN_PERMISSION} When a grant is neither a defined key nor a valid wildcard
       */
      async revokePermissions(grants: readonly (Key | Wildcard)[]): Promise<void> {
        const revoked = new Set<string>(assertGrants(permissions, grants))
        const remaining = (this.permissions ?? []).filter((stored) => {
          return !revoked.has(stored) && !revoked.has(permissions.canonical(stored))
        })

        await storeList(this, 'permissions', remaining)
      }
    }

    return WithPermissionsImpl
  }
}
