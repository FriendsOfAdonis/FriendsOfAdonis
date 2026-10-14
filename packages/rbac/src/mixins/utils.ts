import { E_UNKNOWN_PERMISSION } from '../errors.ts'
import { forgetGrants } from '../grants_cache.ts'
import type { Permissions } from '../permissions.ts'
import type { PermissionHolder } from '../types.ts'

/**
 * Returns the values without duplicates, keeping the first occurrence.
 */
export function unique<T>(values: Iterable<T>): T[] {
  return [...new Set(values)]
}

/**
 * Returns the grants of the class the mixin extends, when it is a
 * holder too. This is how "withPermissions" and the role mixins merge their
 * grants regardless of the order they are composed in.
 *
 * Reading the parent prototype is required because the generic
 * superclass of a mixin does not declare "getGrants", so "super.getGrants"
 * does not type check.
 */
export async function parentGrants(mixin: { prototype: object }, row: object): Promise<string[]> {
  const parent = Object.getPrototypeOf(mixin.prototype) as Partial<PermissionHolder>
  if (typeof parent.getGrants !== 'function') {
    return []
  }

  return parent.getGrants.call(row)
}

/**
 * Returns the values when every one of them is a writable grant.
 *
 * @throws {E_UNKNOWN_PERMISSION} When a value is neither a defined key nor a valid wildcard
 */
export function assertGrants<Writable extends string>(
  permissions: Permissions<string, string, string>,
  grants: Iterable<Writable>
): Writable[] {
  const values = [...grants]
  for (const value of values) {
    if (!permissions.isGrant(value)) {
      throw new E_UNKNOWN_PERMISSION(value)
    }
  }

  return values
}

/**
 * Returns whether two lists hold the same values in the same order.
 */
export function sameList(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

/**
 * Serializes a list for a JSON column.
 */
export function prepareList(value: unknown): string {
  return JSON.stringify(Array.isArray(value) ? value : [])
}

/**
 * Reads a JSON list column. Accepts a JSON string (sqlite, mysql, text
 * columns), an already parsed array (pg json and jsonb) and null.
 * Non string items are dropped.
 */
export function consumeList(value: unknown): string[] {
  let parsed = value
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value)
    } catch {
      parsed = []
    }
  }

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter((item): item is string => typeof item === 'string')
}

/**
 * Assigns the list to the column when it changed, persists the row and
 * forgets the grants cached for Bouncer. Lucid rows are proxies, which
 * rules out private class members, hence a function.
 */
export async function storeList<Column extends string>(
  row: { [K in Column]: string[] } & { save(): Promise<unknown> },
  column: Column,
  values: string[]
): Promise<void> {
  const current: unknown = row[column]
  if (!Array.isArray(current) || !sameList(current, values)) {
    ;(row as Record<Column, string[]>)[column] = values
  }

  try {
    await row.save()
  } finally {
    forgetGrants(row)
  }
}
