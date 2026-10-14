import { E_INVALID_PERMISSION_DEFINITION } from './errors.ts'
import { isPath, NAME_PATTERN, type PermissionRegistry } from './grants.ts'
import { Permissions } from './permissions.ts'
import type {
  ActiveOf,
  InactiveOf,
  KeysOf,
  NamespacesOf,
  PermissionEntry,
  PermissionsDefinition,
  PermissionsOptions,
  PermissionTree,
  WildcardsOf,
} from './types.ts'

/**
 * Turns "blog_post" into "blog post".
 */
function humanize(name: string): string {
  return name.replace(/[_-]+/g, ' ')
}

/**
 * Generates the description of a permission from its last two segments,
 * as in "Publish article" for "blog.article.publish".
 */
function describe(path: readonly string[]): string {
  const verb = humanize(path[path.length - 1])
  return `${verb.charAt(0).toUpperCase()}${verb.slice(1)} ${humanize(path[path.length - 2])}`
}

/**
 * Throws when a segment name is invalid.
 */
function assertName(name: string): void {
  if (!NAME_PATTERN.test(name)) {
    throw new E_INVALID_PERMISSION_DEFINITION(
      `Invalid permission name "${name}". Only letters, digits, "_" and "-" are allowed`
    )
  }
}

/**
 * Returns whether the path is a defined key or namespace.
 */
function isDefined(registry: PermissionRegistry, path: string): boolean {
  return registry.entries.has(path) || registry.namespaces.has(path)
}

/**
 * Walks a namespace and registers its keys and nested namespaces.
 */
function walk(registry: PermissionRegistry, parent: readonly string[], tree: PermissionTree) {
  registry.namespaces.add(parent.join('.'))

  for (const [name, value] of Object.entries(tree)) {
    assertName(name)
    const path = [...parent, name]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      walk(registry, path, value)
      continue
    }

    const key = path.join('.')
    if (value !== true && typeof value !== 'string') {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Invalid definition for permission "${key}". Expected true, a description or a nested namespace`
      )
    }

    const entry: PermissionEntry = {
      key,
      path: Object.freeze(path),
      description: value === true ? describe(path) : value,
      inactive: false,
    }
    registry.entries.set(key, entry)
  }
}

/**
 * Validates the aliases and registers them.
 */
function registerAliases(registry: PermissionRegistry, aliases: Record<string, string>) {
  for (const [alias, target] of Object.entries(aliases)) {
    if (!isPath(alias)) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Invalid alias "${alias}". Aliases must be dot paths, as in "resource.action"`
      )
    }

    if (isDefined(registry, alias)) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Alias "${alias}" collides with a defined permission or namespace`
      )
    }

    if (!isDefined(registry, target)) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Alias "${alias}" targets "${target}", which is neither a defined permission nor a namespace`
      )
    }

    if (registry.entries.has(target) && !alias.includes('.')) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Alias "${alias}" targets the permission "${target}". Permission aliases need at least two segments, as in "resource.action"`
      )
    }

    registry.aliases.set(alias, target)
  }
}

/**
 * Validates the inactive paths and flags the entries they cover.
 */
function markInactive(registry: PermissionRegistry, paths: readonly string[]) {
  for (const path of paths) {
    if (!isDefined(registry, path)) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Inactive path "${path}" is neither a defined permission nor a namespace`
      )
    }

    for (const entry of registry.entries.values()) {
      if (entry.key === path || entry.key.startsWith(`${path}.`)) {
        entry.inactive = true
      }
    }
  }
}

/**
 * Validates the definition and builds the registry.
 *
 * @throws {E_INVALID_PERMISSION_DEFINITION} When a name, an alias or an
 * inactive path is invalid, or when an action sits at the root.
 */
function buildRegistry(
  definition: PermissionsDefinition,
  options: PermissionsOptions
): PermissionRegistry {
  const registry: PermissionRegistry = {
    entries: new Map(),
    namespaces: new Set(),
    aliases: new Map(),
  }

  for (const [name, tree] of Object.entries(definition)) {
    assertName(name)
    if (typeof tree !== 'object' || tree === null || Array.isArray(tree)) {
      throw new E_INVALID_PERMISSION_DEFINITION(
        `Invalid permission "${name}". Permissions must be nested under at least one namespace, as in "resource.action"`
      )
    }

    walk(registry, [name], tree)
  }

  registerAliases(registry, options.aliases ?? {})
  markInactive(registry, options.inactive ?? [])

  for (const entry of registry.entries.values()) {
    Object.freeze(entry)
  }

  return registry
}

/**
 * Defines the permissions of the application as a tree of namespaces.
 * Each key is the dot path to an action, as in "article.publish" or
 * "admin.user.ban". An action accepts `true` (generated description) or
 * a description string.
 *
 * @throws {E_INVALID_PERMISSION_DEFINITION} When the definition is invalid
 *
 * @example
 * export const permissions = definePermissions(
 *   {
 *     article: { publish: true, archive: 'Archive old articles' },
 *     admin: { user: { ban: true, impersonate: true } },
 *   },
 *   {
 *     aliases: { 'article.release': 'article.publish' },
 *     inactive: ['admin.user.impersonate'],
 *   }
 * )
 */
export function definePermissions<
  const T extends PermissionsDefinition,
  const O extends PermissionsOptions<KeysOf<T> | NamespacesOf<T>> = {},
>(
  definition: T,
  options?: O
): Permissions<KeysOf<T>, ActiveOf<KeysOf<T>, InactiveOf<O>>, WildcardsOf<T>> {
  /**
   * The registry is built from the same tree the key types are computed from.
   */
  const registry = buildRegistry(definition, options ?? {}) as PermissionRegistry<KeysOf<T>>
  return new Permissions(registry)
}
