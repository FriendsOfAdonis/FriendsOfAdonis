import { Bouncer } from '@adonisjs/bouncer'
import { Access } from './access.ts'
import { cachedGrants } from './grants_cache.ts'
import {
  canonicalGrant,
  isWritableGrant,
  resolveGrants,
  type PermissionRegistry,
} from './grants.ts'
import type {
  PermissionAbilities,
  PermissionAbility,
  PermissionEntry,
  PermissionHolder,
} from './types.ts'

/**
 * Permissions holds a normalized permissions definition and resolves raw
 * grants against it. Instances are created with "definePermissions".
 *
 * @example
 * const permissions = definePermissions({
 *   article: { create: true, delete: 'Delete articles' },
 * })
 *
 * permissions.resolve(['article.*'])
 * // ['article.create', 'article.delete']
 */
export class Permissions<
  Key extends string = string,
  Active extends Key = Key,
  Wildcard extends string = string,
> {
  /**
   * Normalized lookup tables of the definition.
   */
  #registry: PermissionRegistry<Key>

  /**
   * Generated Bouncer abilities, built on first access.
   */
  #abilities?: PermissionAbilities<Active>

  /**
   * @param registry - Validated lookup tables built by "definePermissions"
   */
  constructor(registry: PermissionRegistry<Key>) {
    this.#registry = registry
  }

  /**
   * Returns every permission entry, including inactive ones, in
   * definition order.
   */
  all(): PermissionEntry<Key>[] {
    return [...this.#registry.entries.values()]
  }

  /**
   * Returns every permission key, including inactive ones.
   */
  keys(): Key[] {
    return [...this.#registry.entries.keys()]
  }

  /**
   * Returns the active permission keys.
   */
  active(): Active[] {
    return this.all()
      .filter((entry) => !entry.inactive)
      .map((entry) => entry.key as Active)
  }

  /**
   * Returns the entry of a key or of an alias. Returns undefined for
   * unknown values, namespaces and wildcards.
   */
  find(value: string): PermissionEntry<Key> | undefined {
    return this.#registry.entries.get(this.canonical(value) as Key)
  }

  /**
   * Returns the canonical form of a stored grant, with aliases rewritten.
   * Values matched by no alias are returned unchanged.
   *
   * @example
   * permissions.canonical('shop.*') // 'store.*' with the alias shop → store
   */
  canonical(value: string): string {
    return canonicalGrant(this.#registry, value)
  }

  /**
   * Returns the aliases resolving to a key, including the paths produced
   * by namespace aliases.
   */
  aliasesOf(key: Key): string[] {
    const aliases: string[] = []
    for (const [alias, target] of this.#registry.aliases) {
      let candidate: string | undefined
      if (key === target) {
        candidate = alias
      } else if (key.startsWith(`${target}.`)) {
        candidate = `${alias}${key.slice(target.length)}`
      }

      /**
       * A longer alias may shadow the candidate, hence the round trip.
       */
      if (candidate !== undefined && this.canonical(candidate) === key) {
        aliases.push(candidate)
      }
    }

    return aliases
  }

  /**
   * Returns whether the value is writable as a grant: a defined key or a
   * wildcard targeting a defined namespace. Use it to validate
   * untrusted input, such as the payload of an admin UI.
   *
   * Bound to the instance, so it can be passed as a callback.
   *
   * @example
   * input.filter(permissions.isGrant)
   */
  isGrant = (value: unknown): value is Key | Wildcard => {
    return isWritableGrant(this.#registry, value)
  }

  /**
   * Resolves raw grants to active keys. Aliases map to their canonical
   * key, wildcards expand, inactive and unknown values are dropped.
   *
   * @param grants - Raw grants, as stored in the database or on a token
   */
  resolve(grants: Iterable<string>): Active[] {
    return resolveGrants(this.#registry, grants) as Active[]
  }

  /**
   * Creates an Access instance from raw grants.
   *
   * @param grants - Raw grants, as stored in the database or on a token
   */
  access(grants: Iterable<string>): Access<Active> {
    return new Access(this.resolve(grants), (values) => this.resolve(values))
  }

  /**
   * Creates an Access instance from the grants of a holder. The grants
   * are always loaded fresh.
   */
  async accessFor(holder: PermissionHolder): Promise<Access<Active>> {
    return this.access(await holder.getGrants())
  }

  /**
   * Returns one Bouncer ability per active key. The object is built once
   * and the same instance is returned on every call.
   *
   * Each ability loads the grants of the holder once per holder instance
   * and accepts an optional scope (typically the abilities of an access
   * token) to narrow the check. Guests are denied.
   */
  abilities(): PermissionAbilities<Active> {
    if (this.#abilities) {
      return this.#abilities
    }

    const abilities: Partial<Record<Active, PermissionAbility>> = {}
    for (const key of this.active()) {
      abilities[key] = Bouncer.ability(
        async (holder: PermissionHolder, scope?: readonly string[]) => {
          let access = this.access(await cachedGrants(holder))
          if (Array.isArray(scope)) {
            access = access.scope(scope)
          }

          return access.allows(key)
        }
      )
    }

    /**
     * Every active key has been assigned by the loop above.
     */
    this.#abilities = Object.freeze(abilities as PermissionAbilities<Active>)
    return this.#abilities
  }
}
