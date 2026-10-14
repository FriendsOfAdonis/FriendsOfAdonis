import { E_INVALID_ROLE_DEFINITION } from './errors.ts'
import { NAME_PATTERN } from './grants.ts'
import type { Permissions } from './permissions.ts'
import { Roles } from './roles.ts'
import type { RoleEntry, RolesDefinition } from './types.ts'

/**
 * Turns "billing_manager" into "Billing manager".
 */
function describe(name: string): string {
  const words = name.replace(/[_-]+/g, ' ')
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`
}

/**
 * Validates the definition and builds the role entries.
 *
 * @throws {E_INVALID_ROLE_DEFINITION} When a name or a grant is invalid
 */
function buildEntries(
  permissions: Permissions<string, string, string>,
  definition: RolesDefinition
): Map<string, RoleEntry> {
  const entries = new Map<string, RoleEntry>()

  for (const [name, role] of Object.entries(definition)) {
    if (!NAME_PATTERN.test(name)) {
      throw new E_INVALID_ROLE_DEFINITION(
        `Invalid role name "${name}". Only letters, digits, "_" and "-" are allowed`
      )
    }

    if (typeof role !== 'object' || role === null || !Array.isArray(role.permissions)) {
      throw new E_INVALID_ROLE_DEFINITION(
        `Invalid role "${name}". Expected an object with a "permissions" list`
      )
    }

    for (const grant of role.permissions) {
      if (!permissions.isGrant(grant)) {
        throw new E_INVALID_ROLE_DEFINITION(
          `Invalid grant "${String(grant)}" in role "${name}". Expected a defined permission key or wildcard`
        )
      }
    }

    entries.set(
      name,
      Object.freeze({
        name,
        description: role.description ?? describe(name),
        permissions: Object.freeze([...role.permissions]),
      })
    )
  }

  return entries
}

/**
 * Defines the roles of the application in code. Each role lists grants
 * (permission keys or wildcards) typed against the permissions. Assign
 * them to a model with the "withRoles" mixin.
 *
 * @throws {E_INVALID_ROLE_DEFINITION} When the definition is invalid
 *
 * @example
 * export const roles = defineRoles(permissions, {
 *   editor: { description: 'Manages articles', permissions: ['article.*'] },
 *   admin: { description: 'Full access', permissions: ['*'] },
 * })
 */
export function defineRoles<
  Key extends string,
  Active extends Key,
  Wildcard extends string,
  const R extends RolesDefinition<Key | Wildcard>,
>(
  permissions: Permissions<Key, Active, Wildcard>,
  definition: R
): Roles<keyof R & string, Key, Active, Wildcard> {
  const entries = buildEntries(permissions, definition) as Map<
    keyof R & string,
    RoleEntry<keyof R & string>
  >
  return new Roles(permissions, entries)
}
