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
 * The error names the model only. Dumping the instance would leak its
 * attributes into the logs, a password not hashed yet for example.
 *
 * @param instance - The model instance to read the primary key from
 * @param intent - The action to mention in the error message, for
 * example "generate an OTP for"
 */
export function primaryKeyOf(instance: LucidRow, intent: string): RecordId {
  const id = instance.$primaryKeyValue

  if (id === undefined || id === null) {
    throw new RuntimeException(
      `Cannot ${intent} an unsaved "${instance.constructor.name}": the primary key is empty`
    )
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

/**
 * A manager, or a function returning it. The function form defers
 * the resolution to the first use, so that a model can be defined
 * before the manager exists.
 */
export type ManagerReference<T> = T | (() => T)

/**
 * Resolves the manager a mixin works with.
 *
 * An explicit manager is returned as is, and a function is called.
 * Without either, the manager is read from the service of the
 * package. The mixins call it from a static getter of the model, so
 * that composing the mixin never touches the service: the model can
 * be defined before the application has booted, in a config file or
 * a provider for example.
 *
 * @param manager - The manager given to the mixin, when any
 * @param service - Function reading the service of the package. It
 * returns undefined until the application has booted
 * @param name - The name of the manager, mentioned in the error when
 * it is used before the application has booted
 *
 * @example
 * static get $magicLinkManager() {
 *   return resolveManager(manager, () => magicLink, 'magic link')
 * }
 */
export function resolveManager<T extends object>(
  manager: ManagerReference<T> | undefined,
  service: () => T | undefined,
  name: string
): T {
  if (manager) {
    return typeof manager === 'function' ? (manager as () => T)() : manager
  }

  const instance = service()

  if (!instance) {
    throw new RuntimeException(
      `Cannot use the ${name} manager before the application has booted. Make sure the "@foadonis/sentinel/sentinel_provider" provider is registered in "adonisrc.ts"`
    )
  }

  return instance
}
