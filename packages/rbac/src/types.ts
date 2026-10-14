import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import type { Permissions } from './permissions.ts'
import type { Roles } from './roles.ts'

/**
 * A namespace of permissions. Each value is either an action (`true` for
 * a generated description, or a description string) or a nested
 * namespace.
 *
 * @example
 * { create: true, delete: 'Delete articles', comment: { moderate: true } }
 */
export interface PermissionTree {
  readonly [name: string]: true | string | PermissionTree
}

/**
 * The tree accepted by "definePermissions". The root only holds
 * namespaces, so every key has at least two segments, as in
 * "resource.action".
 */
export interface PermissionsDefinition {
  readonly [namespace: string]: PermissionTree
}

/**
 * Options accepted by "definePermissions".
 */
export interface PermissionsOptions<Path extends string = string> {
  /**
   * Legacy paths rewritten to a defined key or namespace when found in
   * stored grants. A namespace alias rewrites every grant below it, so
   * `{ shop: 'store' }` turns "shop.*" into "store.*". Defaults to no
   * aliases.
   */
  aliases?: { readonly [alias: string]: Path }

  /**
   * Keys or namespaces that stay in the definition but never grant
   * access. Defaults to an empty list.
   */
  inactive?: readonly Path[]
}

/**
 * Normalized metadata of a single permission.
 */
export interface PermissionEntry<Key extends string = string> {
  /**
   * Canonical key, as in "article.create" or "admin.user.ban".
   */
  key: Key

  /**
   * Segments of the key, as in ["admin", "user", "ban"].
   */
  path: readonly string[]

  /**
   * Human readable description.
   */
  description: string

  /**
   * Whether the permission is inactive. Inactive permissions never grant access.
   */
  inactive: boolean
}

/**
 * Every permission key (including inactive ones) produced by a tree.
 */
export type KeysOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object ? KeysOf<T[K], `${Prefix}${K}.`> : `${Prefix}${K}`
}[keyof T & string]

/**
 * Every namespace produced by a tree, as dot paths.
 */
export type NamespacesOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object
    ? `${Prefix}${K}` | NamespacesOf<T[K], `${Prefix}${K}.`>
    : never
}[keyof T & string]

/**
 * The paths listed in the "inactive" option.
 */
export type InactiveOf<O> = O extends { inactive: readonly (infer Path extends string)[] }
  ? Path
  : never

/**
 * The keys left active once the inactive keys and namespaces are removed.
 */
export type ActiveOf<Key extends string, Inactive extends string> = Key extends
  | Inactive
  | `${Inactive}.${string}`
  ? never
  : Key

/**
 * The wildcard grants accepted for a tree: "*" and "namespace.*".
 */
export type WildcardsOf<T> = '*' | `${NamespacesOf<T>}.*`

/**
 * Definition of a role declared in code.
 */
export interface RoleDefinition<Grant extends string = string> {
  /**
   * Human readable description. Defaults to the humanized role name,
   * for example "Billing manager" for "billing_manager".
   */
  description?: string

  /**
   * Grants of the role: permission keys or wildcards.
   */
  permissions: readonly Grant[]
}

/**
 * The map of role names to definitions accepted by "defineRoles".
 */
export interface RolesDefinition<Grant extends string = string> {
  readonly [name: string]: RoleDefinition<Grant>
}

/**
 * Normalized metadata of a role declared in code.
 */
export interface RoleEntry<Name extends string = string> {
  /**
   * Unique name of the role.
   */
  name: Name

  /**
   * Human readable description.
   */
  description: string

  /**
   * Grants of the role, as declared.
   */
  permissions: readonly string[]
}

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
 * The role names of a "Roles" instance.
 *
 * @example
 * type Name = RoleName<typeof roles>
 */
export type RoleName<R> =
  R extends Roles<infer Name, infer _Key, infer _Active, infer _Wildcard> ? Name : never

/**
 * Anything able to list its raw grants. Models get it from the
 * "withPermissions", "withRoles" and "withRoleModel" mixins.
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
 * Instance members added by the "withRoles" mixin.
 */
export interface WithRolesRow<Name extends string, Active extends string> extends PermissionHolder {
  /**
   * Names of the roles stored on the row, including names no longer
   * defined in code.
   */
  roles: string[]

  /**
   * Returns the assigned roles that are defined in code.
   */
  getRoles(): Name[]

  /**
   * Returns whether the row has the role.
   */
  hasRole(name: Name): boolean

  /**
   * Assigns a role and persists the row. Assigning a role twice is a no-op.
   */
  assignRole(name: Name): Promise<void>

  /**
   * Assigns several roles and persists the row. Assigned roles are skipped.
   */
  assignRoles(names: readonly Name[]): Promise<void>

  /**
   * Replaces every assigned role and persists the row.
   */
  syncRoles(names: readonly Name[]): Promise<void>

  /**
   * Removes a role and persists the row.
   */
  revokeRole(name: Name): Promise<void>

  /**
   * Removes several roles and persists the row.
   */
  revokeRoles(names: readonly Name[]): Promise<void>

  /**
   * Returns the resolved active permissions of the row.
   */
  getPermissions(): Promise<Active[]>

  /**
   * Returns whether the row holds the given active permission.
   */
  hasPermission(key: Active): Promise<boolean>
}

/**
 * Shape of the rows of a role model usable with "withRoleModel".
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
 * Options accepted by the "withRoleModel" mixin.
 */
export interface WithRoleModelOptions<Role extends RoleModel> {
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
 * Instance members added by the "withRoleModel" mixin.
 */
export interface WithRoleModelRow<
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
