import type { Permissions } from './permissions.ts'
import type { RoleEntry } from './types.ts'

/**
 * Roles holds the roles declared in code and the permissions they are
 * typed against. Instances are created with "defineRoles".
 *
 * @example
 * const roles = defineRoles(permissions, {
 *   editor: { permissions: ['article.*'] },
 * })
 *
 * roles.grantsOf(['editor']) // ['article.*']
 */
export class Roles<
  Name extends string = string,
  Key extends string = string,
  Active extends Key = Key,
  Wildcard extends string = string,
> {
  /**
   * The permissions the roles grant.
   */
  readonly permissions: Permissions<Key, Active, Wildcard>

  /**
   * Validated roles by name, in definition order.
   */
  #entries: ReadonlyMap<Name, RoleEntry<Name>>

  /**
   * @param permissions - The permissions the roles are typed against
   * @param entries - Validated roles built by "defineRoles"
   */
  constructor(
    permissions: Permissions<Key, Active, Wildcard>,
    entries: ReadonlyMap<Name, RoleEntry<Name>>
  ) {
    this.permissions = permissions
    this.#entries = entries
  }

  /**
   * Returns the role names in definition order.
   */
  names(): Name[] {
    return [...this.#entries.keys()]
  }

  /**
   * Returns every role in definition order.
   */
  all(): RoleEntry<Name>[] {
    return [...this.#entries.values()]
  }

  /**
   * Returns the role of a name. Returns undefined for unknown names.
   */
  find(name: string): RoleEntry<Name> | undefined {
    return this.#entries.get(name as Name)
  }

  /**
   * Returns whether the value is the name of a defined role. Use it to
   * validate untrusted input, such as the payload of an admin UI.
   *
   * Bound to the instance, so it can be passed as a callback.
   *
   * @example
   * input.filter(roles.isRole)
   */
  isRole = (value: unknown): value is Name => {
    return typeof value === 'string' && this.#entries.has(value as Name)
  }

  /**
   * Returns the grants of the named roles without duplicates. Unknown
   * names are ignored, so a role removed from the code grants nothing.
   *
   * @param names - Role names, as stored on a holder
   */
  grantsOf(names: Iterable<string>): string[] {
    const grants = new Set<string>()
    for (const name of names) {
      for (const grant of this.find(name)?.permissions ?? []) {
        grants.add(grant)
      }
    }

    return [...grants]
  }
}
