import { inspect } from 'node:util'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { LucidRow } from '@adonisjs/lucid/types/model'
import type { RecordId } from './types.ts'

/**
 * Class decorator to ensure a class implements the static side of an
 * interface. The check happens at compile time only, the decorator
 * returns the class untouched.
 *
 * @example
 * @staticImplements<WithOTPClass>()
 * class WithOTPImpl extends superclass {}
 */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor
}

/**
 * Returns the primary key value of a model instance. Throws when the
 * instance has not been persisted yet and has no primary key.
 *
 * @param instance - The model instance to read the primary key from
 * @param intent - The action to mention in the error message, for
 * example "generate an OTP for"
 */
export function primaryKeyOf(instance: LucidRow, intent: string): RecordId {
  const id = instance.$primaryKeyValue

  if (id === undefined || id === null) {
    throw new RuntimeException(`Cannot ${intent} ${inspect(instance)}: the primary key is empty`)
  }

  return id
}

/**
 * Wraps the import of an optional peer dependency. The returned loader
 * raises a descriptive error when the package is not installed, instead
 * of the module resolution error of Node.js.
 *
 * @param name - The name of the package, as it should be installed
 * @param loader - Function importing the package
 */
export function optionalDependency<T>(name: string, loader: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await loader()
    } catch (error) {
      /**
       * Re-throw the errors raised by the package itself
       */
      const code = (error as { code?: string } | null)?.code
      if (code !== 'ERR_MODULE_NOT_FOUND' && code !== 'MODULE_NOT_FOUND') throw error

      throw new RuntimeException(
        `Cannot find package "${name}". It is required by the TOTP authenticators: install it with "npm install ${name}"`
      )
    }
  }
}
