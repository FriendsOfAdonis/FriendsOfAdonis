import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import type { Permissions } from './permissions.ts'

/**
 * Definition of a single action. Use `true` for a generated description,
 * a string for a custom description, or an object for full control.
 */
export type ActionDefinition =
  | true
  | string
  | {
      /**
       * Human readable description. Defaults to a description generated
       * from the action and resource names, for example "Create product".
       */
      description?: string

      /**
       * Inactive permissions stay in the definition but never grant
       * access. Defaults to false.
       */
      inactive?: boolean

      /**
       * Legacy keys that resolve to this permission when found in stored
       * grants. Defaults to an empty list.
       */
      aliases?: readonly string[]
    }

/**
 * A map of resources to their actions, for example
 * `{ product: { create: true } }`.
 */
export type ResourcesDefinition = Record<string, Record<string, ActionDefinition>>

/**
 * A group of resources namespaced under a prefix. Created with the
 * "prefix" function.
 */
export interface PrefixedDefinition<P extends string, R extends ResourcesDefinition> {
  /**
   * The prefix prepended to every key of the group, as in "admin:product.create".
   */
  readonly prefix: P

  /**
   * The resources namespaced under the prefix.
   */
  readonly resources: R
}

/**
 * Any value accepted by "definePermissions".
 */
export type PermissionsDefinition =
  | ResourcesDefinition
  | PrefixedDefinition<string, ResourcesDefinition>

/**
 * Normalized metadata of a single permission.
 */
export interface PermissionEntry<Key extends string = string> {
  /**
   * Canonical key, as in "product.create" or "admin:product.create".
   */
  key: Key

  /**
   * Prefix of the key, when the permission was defined with "prefix".
   */
  prefix?: string

  /**
   * Resource segment of the key.
   */
  resource: string

  /**
   * Action segment of the key.
   */
  action: string

  /**
   * Human readable description.
   */
  description: string

  /**
   * Whether the permission is inactive. Inactive permissions never grant access.
   */
  inactive: boolean

  /**
   * Legacy keys resolving to this permission.
   */
  aliases: readonly string[]
}

/**
 * A stored grant parsed into its shape. Exact keys and aliases share
 * the "key" kind, the other kinds are wildcards.
 */
export type ParsedGrant =
  | {
      /**
       * Matches every active permission ("*").
       */
      kind: 'all'
    }
  | {
      /**
       * Matches every active permission of a prefix ("admin:*").
       */
      kind: 'prefix'

      /**
       * The matched prefix.
       */
      prefix: string
    }
  | {
      /**
       * Matches every active action of a resource ("product.*" or "admin:product.*").
       */
      kind: 'resource'

      /**
       * The prefix of the resource, when any.
       */
      prefix?: string

      /**
       * The matched resource.
       */
      resource: string
    }
  | {
      /**
       * Matches a single permission by key or alias.
       */
      kind: 'key'

      /**
       * The key or alias.
       */
      key: string
    }

/**
 * Builds the "resource.action" keys of a resources definition. Inactive
 * actions are dropped when Mode is "active".
 */
type ResourceKeys<R, Mode extends 'all' | 'active'> = {
  [Res in keyof R & string]: {
    [A in keyof R[Res] & string]: Mode extends 'active'
      ? R[Res][A] extends { inactive: true }
        ? never
        : `${Res}.${A}`
      : `${Res}.${A}`
  }[keyof R[Res] & string]
}[keyof R & string]

/**
 * Every permission key (including inactive ones) produced by a definition.
 */
export type KeysOf<D> =
  D extends PrefixedDefinition<infer P, infer R>
    ? `${P}:${ResourceKeys<R, 'all'>}`
    : D extends ResourcesDefinition
      ? ResourceKeys<D, 'all'>
      : never

/**
 * The active permission keys produced by a definition.
 */
export type ActiveKeysOf<D> =
  D extends PrefixedDefinition<infer P, infer R>
    ? `${P}:${ResourceKeys<R, 'active'>}`
    : D extends ResourcesDefinition
      ? ResourceKeys<D, 'active'>
      : never

/**
 * The wildcard grants accepted for a definition: "*", "prefix:*",
 * "resource.*" and "prefix:resource.*".
 */
export type WildcardsOf<D> =
  | '*'
  | (D extends PrefixedDefinition<infer P, infer R>
      ? `${P}:*` | `${P}:${keyof R & string}.*`
      : D extends ResourcesDefinition
        ? `${keyof D & string}.*`
        : never)

/**
 * Every permission key of a "Permissions" instance, including inactive ones.
 *
 * @example
 * type Key = PermissionKey<typeof permissions>
 */
export type PermissionKey<P> =
  P extends Permissions<infer Key, infer _Active, infer _Wildcard> ? Key : never

/**
 * The active permission keys of a "Permissions" instance. These are the
 * keys you can check and the Bouncer abilities that get generated.
 *
 * @example
 * type Ability = ActivePermission<typeof permissions>
 */
export type ActivePermission<P> =
  P extends Permissions<infer _Key, infer Active, infer _Wildcard> ? Active : never

/**
 * The values accepted by permission writes: a permission key or a wildcard.
 *
 * @example
 * type Writable = Grant<typeof permissions>
 */
export type Grant<P> =
  P extends Permissions<infer Key, infer _Active, infer Wildcard> ? Key | Wildcard : never

/**
 * Anything able to list its raw grants. Models get it from the
 * "withPermissions" and "withRoles" mixins.
 */
export interface PermissionHolder {
  /**
   * Returns the raw stored grants (keys, aliases and wildcards).
   */
  getGrants(): Promise<string[]>
}

/**
 * The authorizer wrapped by every generated Bouncer ability. The optional
 * scope narrows the check, typically with access token abilities.
 */
export type PermissionAuthorizer = (
  holder: PermissionHolder,
  scope?: readonly string[]
) => Promise<boolean>

/**
 * A Bouncer ability generated for an active permission key.
 */
export interface PermissionAbility {
  /**
   * Guests are always denied.
   */
  allowGuest: false

  /**
   * The wrapped authorizer.
   */
  original: PermissionAuthorizer

  /**
   * Executes the ability. Invoked by Bouncer.
   */
  execute(
    holder: PermissionHolder | null,
    scope?: readonly string[]
  ): AuthorizerResponse | Promise<AuthorizerResponse>
}

/**
 * The map of Bouncer abilities returned by "permissions.abilities()".
 */
export type PermissionAbilities<Active extends string> = { [K in Active]: PermissionAbility }

/**
 * Instance members added by the "withPermissions" mixin.
 */
export interface WithPermissionsRow<
  Writable extends string,
  Active extends string,
> extends PermissionHolder {
  /**
   * Grants stored directly on the row.
   */
  permissions: string[]

  /**
   * Returns the resolved active permissions of the row.
   */
  getPermissions(): Promise<Active[]>

  /**
   * Returns whether the row holds the given active permission.
   */
  hasPermission(key: Active): Promise<boolean>

  /**
   * Adds a grant and persists the row.
   */
  givePermission(grant: Writable): Promise<void>

  /**
   * Adds several grants and persists the row.
   */
  givePermissions(grants: readonly Writable[]): Promise<void>

  /**
   * Replaces every stored grant and persists the row.
   */
  syncPermissions(grants: readonly Writable[]): Promise<void>

  /**
   * Removes a grant (and the stored aliases of it) and persists the row.
   */
  revokePermission(grant: Writable): Promise<void>

  /**
   * Removes several grants (and the stored aliases of them) and persists the row.
   */
  revokePermissions(grants: readonly Writable[]): Promise<void>
}

/**
 * Shape of the rows of a role model usable with "withRoles".
 */
export type RoleRow = LucidRow &
  PermissionHolder & {
    /**
     * Unique name of the role.
     */
    name: string
  }

/**
 * A Lucid model whose rows can be used as roles.
 */
export type RoleModel = LucidModel & { new (): RoleRow }

/**
 * A role row or its primary key value.
 */
export type RoleReference<Role extends RoleModel> = InstanceType<Role> | number | string

/**
 * Options accepted by the "withRoles" mixin.
 */
export interface WithRolesOptions<Role extends RoleModel> {
  /**
   * Returns the role model.
   */
  role: () => Role

  /**
   * Name of the pivot table linking holders to roles.
   */
  pivotTable: string

  /**
   * Pivot column referencing the holder. Defaults to the Lucid
   * convention, for example "user_id".
   */
  pivotForeignKey?: string

  /**
   * Pivot column referencing the role. Defaults to the Lucid
   * convention, for example "role_id".
   */
  pivotRelatedForeignKey?: string
}

/**
 * Instance members added by the "withRoles" mixin.
 */
export interface WithRolesRow<
  Role extends RoleModel,
  Active extends string,
> extends PermissionHolder {
  /**
   * Many to many relationship with the role model.
   */
  roles: ManyToMany<Role>

  /**
   * Returns the roles of the row. Uses the preloaded relationship when present.
   */
  getRoles(): Promise<InstanceType<Role>[]>

  /**
   * Returns whether the row has the role. A string is matched against the
   * role name, a row against its primary key.
   */
  hasRole(role: string | InstanceType<Role>): Promise<boolean>

  /**
   * Assigns a role. Assigning a role twice is a no-op.
   */
  assignRole(role: RoleReference<Role>): Promise<void>

  /**
   * Assigns several roles. Already assigned roles are skipped.
   */
  assignRoles(roles: readonly RoleReference<Role>[]): Promise<void>

  /**
   * Replaces every assigned role.
   */
  syncRoles(roles: readonly RoleReference<Role>[]): Promise<void>

  /**
   * Removes a role.
   */
  revokeRole(role: RoleReference<Role>): Promise<void>

  /**
   * Removes several roles.
   */
  revokeRoles(roles: readonly RoleReference<Role>[]): Promise<void>

  /**
   * Returns the resolved active permissions of the row.
   */
  getPermissions(): Promise<Active[]>

  /**
   * Returns whether the row holds the given active permission.
   */
  hasPermission(key: Active): Promise<boolean>
}
