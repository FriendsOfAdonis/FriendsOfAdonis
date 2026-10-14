import type { ParsedGrant, PermissionEntry } from './types.ts'

/**
 * Allowed characters for a prefix, a resource or an action.
 */
export const NAME_PATTERN = /^[A-Za-z0-9_-]+$/

/**
 * Matches "resource.action" and "prefix:resource.action".
 */
const KEY_PATTERN = /^(?:([A-Za-z0-9_-]+):)?([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/

/**
 * Matches "prefix:*".
 */
const PREFIX_WILDCARD_PATTERN = /^([A-Za-z0-9_-]+):\*$/

/**
 * Matches "resource.*" and "prefix:resource.*".
 */
const RESOURCE_WILDCARD_PATTERN = /^(?:([A-Za-z0-9_-]+):)?([A-Za-z0-9_-]+)\.\*$/

/**
 * Normalized lookup tables built from a permissions definition.
 */
export interface PermissionRegistry<Key extends string = string> {
  /**
   * Entries by canonical key, in definition order.
   */
  entries: Map<Key, PermissionEntry<Key>>

  /**
   * Canonical key by alias.
   */
  aliases: Map<string, Key>

  /**
   * Every defined prefix.
   */
  prefixes: Set<string>

  /**
   * Every defined resource, identified with "resourceId".
   */
  resources: Set<string>
}

/**
 * Returns the identifier of a resource inside the registry, as in
 * "product" or "admin:product".
 */
export function resourceId(prefix: string | undefined, resource: string): string {
  return prefix === undefined ? resource : `${prefix}:${resource}`
}

/**
 * Splits a "[prefix:]resource.action" key into its segments. Returns
 * null when the value is not shaped like a key.
 */
export function parseKey(
  value: string
): { prefix?: string; resource: string; action: string } | null {
  const match = KEY_PATTERN.exec(value)
  if (!match) {
    return null
  }

  return { prefix: match[1], resource: match[2], action: match[3] }
}

/**
 * Parses a raw grant. Returns null when the value is neither a key nor
 * a wildcard.
 */
export function parseGrant(value: string): ParsedGrant | null {
  if (value === '*') {
    return { kind: 'all' }
  }

  const prefixMatch = PREFIX_WILDCARD_PATTERN.exec(value)
  if (prefixMatch) {
    return { kind: 'prefix', prefix: prefixMatch[1] }
  }

  const resourceMatch = RESOURCE_WILDCARD_PATTERN.exec(value)
  if (resourceMatch) {
    return { kind: 'resource', prefix: resourceMatch[1], resource: resourceMatch[2] }
  }

  if (KEY_PATTERN.test(value)) {
    return { kind: 'key', key: value }
  }

  return null
}

/**
 * Returns whether the entry is matched by the parsed grant. Aliases are
 * resolved through the registry.
 */
function matches<Key extends string>(
  registry: PermissionRegistry<Key>,
  grant: ParsedGrant,
  entry: PermissionEntry<Key>
): boolean {
  switch (grant.kind) {
    case 'all':
      return true
    case 'prefix':
      return entry.prefix === grant.prefix
    case 'resource':
      return entry.prefix === grant.prefix && entry.resource === grant.resource
    case 'key':
      return entry.key === grant.key || registry.aliases.get(grant.key) === entry.key
  }
}

/**
 * Resolves raw grants to the active keys they cover, in definition order.
 * Aliases map to their canonical key, wildcards expand to active keys,
 * inactive and unknown values are dropped.
 */
export function resolveGrants<Key extends string>(
  registry: PermissionRegistry<Key>,
  grants: Iterable<string>
): Key[] {
  const parsed: ParsedGrant[] = []
  for (const grant of grants) {
    const result = typeof grant === 'string' ? parseGrant(grant) : null
    if (result) {
      parsed.push(result)
    }
  }

  const resolved: Key[] = []
  for (const entry of registry.entries.values()) {
    if (!entry.inactive && parsed.some((grant) => matches(registry, grant, entry))) {
      resolved.push(entry.key)
    }
  }

  return resolved
}

/**
 * Returns whether the value can be written as a grant: a defined key
 * (active or not) or a wildcard targeting a defined prefix or resource.
 * Aliases are not writable.
 */
export function isWritableGrant(registry: PermissionRegistry, value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const grant = parseGrant(value)
  if (!grant) {
    return false
  }

  switch (grant.kind) {
    case 'all':
      return true
    case 'prefix':
      return registry.prefixes.has(grant.prefix)
    case 'resource':
      return registry.resources.has(resourceId(grant.prefix, grant.resource))
    case 'key':
      return registry.entries.has(grant.key)
  }
}
