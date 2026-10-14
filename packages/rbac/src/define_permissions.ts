import { E_INVALID_PERMISSION_DEFINITION } from './errors.ts'
import { NAME_PATTERN, parseKey, resourceId, type PermissionRegistry } from './grants.ts'
import { Permissions } from './permissions.ts'
import type {
  ActionDefinition,
  ActiveKeysOf,
  KeysOf,
  PermissionEntry,
  PermissionsDefinition,
  PrefixedDefinition,
  ResourcesDefinition,
  WildcardsOf,
} from './types.ts'

/**
 * Namespaces a group of resources under a prefix. The keys of the group
 * become "prefix:resource.action".
 *
 * @example
 * definePermissions(
 *   prefix('admin', { product: { create: true } }),
 *   { billing: { refund: true } }
 * )
 * // keys: 'admin:product.create', 'billing.refund'
 */
export function prefix<const P extends string, const R extends ResourcesDefinition>(
  name: P,
  resources: R
): PrefixedDefinition<P, R> {
  return { prefix: name, resources }
}

/**
 * Returns whether the definition was created with "prefix".
 */
function isPrefixed(
  definition: PermissionsDefinition
): definition is PrefixedDefinition<string, ResourcesDefinition> {
  return typeof definition.prefix === 'string' && typeof definition.resources === 'object'
}

/**
 * Turns "blog_post" into "blog post".
 */
function humanize(name: string): string {
  return name.replace(/[_-]+/g, ' ')
}

/**
 * Generates the description of a permission, as in "Create product".
 */
function describe(resource: string, action: string): string {
  const verb = humanize(action)
  return `${verb.charAt(0).toUpperCase()}${verb.slice(1)} ${humanize(resource)}`
}

/**
 * Throws when a prefix, resource or action name is invalid.
 */
function assertName(kind: string, name: string): void {
  if (!NAME_PATTERN.test(name)) {
    throw new E_INVALID_PERMISSION_DEFINITION(
      `Invalid permission ${kind} "${name}". Only letters, digits, "_" and "-" are allowed`
    )
  }
}

/**
 * Normalizes an action definition into an entry.
 */
function toEntry(
  prefixName: string | undefined,
  resource: string,
  action: string,
  definition: ActionDefinition
): PermissionEntry {
  const key = `${resourceId(prefixName, resource)}.${action}`
  const base = { key, prefix: prefixName, resource, action }

  if (definition === true) {
    return { ...base, description: describe(resource, action), inactive: false, aliases: [] }
  }

  if (typeof definition === 'string') {
    return { ...base, description: definition, inactive: false, aliases: [] }
  }

  if (typeof definition !== 'object' || definition === null || Array.isArray(definition)) {
    throw new E_INVALID_PERMISSION_DEFINITION(
      `Invalid definition for permission "${key}". Expected true, a description or an object`
    )
  }

  return {
    ...base,
    description: definition.description ?? describe(resource, action),
    inactive: definition.inactive === true,
    aliases: Object.freeze([...(definition.aliases ?? [])]),
  }
}

/**
 * Validates the definitions and builds the registry.
 *
 * @throws {E_INVALID_PERMISSION_DEFINITION} When a name is invalid, a key
 * is defined twice, or an alias is malformed, collides with a key, or is
 * claimed twice.
 */
function buildRegistry(definitions: readonly PermissionsDefinition[]): PermissionRegistry {
  const registry: PermissionRegistry = {
    entries: new Map(),
    aliases: new Map(),
    prefixes: new Set(),
    resources: new Set(),
  }

  /**
   * First pass: collect every key, so aliases can be checked against
   * keys defined later.
   */
  for (const definition of definitions) {
    const prefixName = isPrefixed(definition) ? definition.prefix : undefined
    const resources = isPrefixed(definition) ? definition.resources : definition

    if (prefixName !== undefined) {
      assertName('prefix', prefixName)
      registry.prefixes.add(prefixName)
    }

    for (const [resource, actions] of Object.entries(resources)) {
      assertName('resource', resource)
      if (typeof actions !== 'object' || actions === null) {
        throw new E_INVALID_PERMISSION_DEFINITION(
          `Invalid actions for resource "${resourceId(prefixName, resource)}". Expected an object`
        )
      }

      registry.resources.add(resourceId(prefixName, resource))

      for (const [action, actionDefinition] of Object.entries(actions)) {
        assertName('action', action)
        const entry = toEntry(prefixName, resource, action, actionDefinition)

        if (registry.entries.has(entry.key)) {
          throw new E_INVALID_PERMISSION_DEFINITION(
            `Duplicate permission "${entry.key}". Each key must be defined once`
          )
        }

        registry.entries.set(entry.key, Object.freeze(entry))
      }
    }
  }

  /**
   * Second pass: register the aliases.
   */
  for (const entry of registry.entries.values()) {
    for (const alias of entry.aliases) {
      if (typeof alias !== 'string' || !parseKey(alias)) {
        throw new E_INVALID_PERMISSION_DEFINITION(
          `Invalid alias "${String(alias)}" for permission "${entry.key}". Aliases must look like "resource.action" or "prefix:resource.action"`
        )
      }

      if (registry.entries.has(alias)) {
        throw new E_INVALID_PERMISSION_DEFINITION(
          `Alias "${alias}" of permission "${entry.key}" collides with an existing permission key`
        )
      }

      const owner = registry.aliases.get(alias)
      if (owner !== undefined) {
        throw new E_INVALID_PERMISSION_DEFINITION(
          `Alias "${alias}" is claimed by both "${owner}" and "${entry.key}"`
        )
      }

      registry.aliases.set(alias, entry.key)
    }
  }

  return registry
}

/**
 * Defines the permissions of the application. Accepts any number of
 * resources definitions and prefixed groups, merged into a single
 * Permissions instance.
 *
 * Each action accepts `true` (generated description), a description
 * string, or an object with "description", "inactive" and "aliases".
 *
 * @throws {E_INVALID_PERMISSION_DEFINITION} When the definition is invalid
 *
 * @example
 * export const permissions = definePermissions(
 *   {
 *     product: {
 *       create: true,
 *       delete: { description: 'Delete products', aliases: ['product.remove'] },
 *       archive: { inactive: true },
 *     },
 *   },
 *   prefix('admin', { user: { ban: 'Ban users' } })
 * )
 */
export function definePermissions<const D extends readonly PermissionsDefinition[]>(
  ...definitions: D
): Permissions<KeysOf<D[number]>, ActiveKeysOf<D[number]>, WildcardsOf<D[number]>> {
  /**
   * The registry is built from the same definitions the key types are
   * computed from.
   */
  const registry = buildRegistry(definitions) as PermissionRegistry<KeysOf<D[number]>>
  return new Permissions(registry)
}
