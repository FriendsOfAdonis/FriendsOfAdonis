import type { PermissionHolder } from './types.ts'

/**
 * Pending or settled grants by holder. Weakly held, so the entries go
 * away with the holder (typically at the end of the request).
 */
const cache = new WeakMap<object, Promise<string[]>>()

/**
 * Returns the grants of a holder, loading them once per holder instance.
 * Used by the generated Bouncer abilities so several checks on the same
 * user cost a single load. A failed load is not cached.
 */
export function cachedGrants(holder: PermissionHolder): Promise<string[]> {
  const cached = cache.get(holder)
  if (cached) {
    return cached
  }

  const pending = holder.getGrants()
  cache.set(holder, pending)

  /**
   * Drop the entry when the load fails, so the next check retries it.
   */
  pending.catch(() => {
    if (cache.get(holder) === pending) {
      cache.delete(holder)
    }
  })

  return pending
}

/**
 * Forgets the cached grants of a holder. The mixin mutations call it on
 * the mutated instance. Call it yourself after changing the grants of a
 * holder through another instance, for example after updating a role.
 *
 * @example
 * await role.givePermission('article.delete')
 * forgetGrants(user)
 */
export function forgetGrants(holder: object): void {
  cache.delete(holder)
}
