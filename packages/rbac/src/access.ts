/**
 * Access is an immutable set of resolved active permissions. Instances
 * are created with "permissions.access()" or "permissions.accessFor()".
 *
 * @example
 * const access = await permissions.accessFor(user)
 * access.allows('product.create')
 *
 * const tokenAccess = access.scope(token.abilities)
 * tokenAccess.allows('product.delete')
 */
export class Access<Active extends string> {
  /**
   * The resolved active keys.
   */
  #granted: ReadonlySet<Active>

  /**
   * Resolves raw grants against the permissions definition. Used by "scope".
   */
  #resolve: (grants: Iterable<string>) => Active[]

  /**
   * @param granted - Active keys already resolved against the definition
   * @param resolve - Resolver of the definition the keys belong to
   */
  constructor(granted: Iterable<Active>, resolve: (grants: Iterable<string>) => Active[]) {
    this.#granted = new Set(granted)
    this.#resolve = resolve
    Object.freeze(this)
  }

  /**
   * Returns true when the permission is granted.
   */
  allows(key: Active): boolean {
    return this.#granted.has(key)
  }

  /**
   * Returns true when the permission is not granted.
   */
  denies(key: Active): boolean {
    return !this.allows(key)
  }

  /**
   * Returns true when every permission is granted. An empty list is
   * always allowed.
   */
  allowsAll(keys: readonly Active[]): boolean {
    return keys.every((key) => this.allows(key))
  }

  /**
   * Returns true when at least one permission is granted. An empty list
   * is never allowed.
   */
  allowsAny(keys: readonly Active[]): boolean {
    return keys.some((key) => this.allows(key))
  }

  /**
   * Returns a new Access limited to the intersection with the given
   * grants. The grants are resolved first, so wildcards and aliases
   * work and `['*']` keeps every permission. The current instance is
   * left untouched.
   *
   * @param grants - Raw grants, typically the abilities of an access token
   */
  scope(grants: Iterable<string>): Access<Active> {
    const allowed = new Set(this.#resolve(grants))
    return new Access(
      [...this.#granted].filter((key) => allowed.has(key)),
      this.#resolve
    )
  }

  /**
   * Returns the granted keys as a new array.
   */
  permissions(): Active[] {
    return [...this.#granted]
  }

  /**
   * Serializes the granted keys, for example to share them with a frontend.
   */
  toJSON(): Active[] {
    return this.permissions()
  }
}
