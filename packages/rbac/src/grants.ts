import type { PermissionEntry } from './types.ts'

/**
 * Allowed characters for each segment of a permission path.
 */
export const NAME_PATTERN = /^[A-Za-z0-9_-]+$/

/**
 * Matches a dot path of one or more segments, as in "admin" or
 * "admin.user.ban".
 */
const PATH_PATTERN = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/

/**
 * Normalized lookup tables built from a permissions definition.
 */
export interface PermissionRegistry<Key extends string = string> {
  /**
   * Entries by canonical key, in definition order.
   */
  entries: Map<Key, PermissionEntry<Key>>

  /**
   * Every defined namespace, as a dot path.
   */
  namespaces: Set<string>

  /**
   * Target path by alias path. A target is a key or a namespace.
   */
  aliases: Map<string, string>
}

/**
 * Returns whether the value is a dot path, as in "admin.user.ban".
 */
export function isPath(value: string): boolean {
  return PATH_PATTERN.test(value)
}

/**
 * Rewrites a grant through the aliases. The longest alias matching the
 * start of the grant wins, so "shop.*" becomes "store.*" with the alias
 * "shop" → "store". Values matched by no alias are returned unchanged.
 */
export function canonicalGrant(registry: PermissionRegistry, value: string): string {
  let source: string | undefined
  for (const alias of registry.aliases.keys()) {
    const matches = value === alias || value.startsWith(`${alias}.`)
    if (matches && (source === undefined || alias.length > source.length)) {
      source = alias
    }
  }

  return source === undefined
    ? value
    : `${registry.aliases.get(source)}${value.slice(source.length)}`
}

/**
 * Returns the keys matched by a canonical grant: every key for "*",
 * every key of a namespace for "namespace.*", the key itself otherwise.
 */
function matcher<Key extends string>(grant: string): (entry: PermissionEntry<Key>) => boolean {
  if (grant === '*') {
    return () => true
  }

  if (grant.endsWith('.*')) {
    const namespace = grant.slice(0, -1)
    return (entry) => entry.key.startsWith(namespace)
  }

  return (entry) => entry.key === grant
}

/**
 * Resolves raw grants to the active keys they cover, in definition order.
 * Aliases are rewritten, wildcards expand to active keys, inactive and
 * unknown values are dropped.
 */
export function resolveGrants<Key extends string>(
  registry: PermissionRegistry<Key>,
  grants: Iterable<string>
): Key[] {
  const matchers: ((entry: PermissionEntry<Key>) => boolean)[] = []
  for (const grant of grants) {
    if (typeof grant !== 'string') {
      continue
    }

    const canonical = canonicalGrant(registry, grant)
    if (isWritableGrant(registry, canonical)) {
      matchers.push(matcher<Key>(canonical))
    }
  }

  const resolved: Key[] = []
  for (const entry of registry.entries.values()) {
    if (!entry.inactive && matchers.some((matches) => matches(entry))) {
      resolved.push(entry.key)
    }
  }

  return resolved
}

/**
 * Returns whether the value can be written as a grant: a defined key
 * (active or not), "*", or a wildcard targeting a defined namespace.
 * Aliases are not writable.
 */
export function isWritableGrant(registry: PermissionRegistry, value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  if (value === '*') {
    return true
  }

  if (value.endsWith('.*')) {
    return registry.namespaces.has(value.slice(0, -2))
  }

  return registry.entries.has(value)
}
