import { inspect } from 'node:util'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { LucidRow } from '@adonisjs/lucid/types/model'
import type { RecordId } from './types.ts'

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor
}

/**
 * Returns the primary key of a model instance, refusing to act on
 * instances that do not have one.
 */
export function primaryKeyOf(instance: LucidRow, intent: string): RecordId {
  const id = instance.$primaryKeyValue

  if (id === undefined || id === null) {
    throw new RuntimeException(`Cannot ${intent} ${inspect(instance)}: the primary key is empty`)
  }

  return id
}

export function optionalDependency<T>(name: string, loader: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await loader()
    } catch (error) {
      const code = (error as { code?: string } | null)?.code
      if (code !== 'ERR_MODULE_NOT_FOUND' && code !== 'MODULE_NOT_FOUND') throw error

      throw new RuntimeException(
        `Cannot find package "${name}". It is required by the TOTP authenticators: install it with "npm install ${name}"`
      )
    }
  }
}
