import { Exception } from '@adonisjs/core/exceptions'

export const E_MISSING_SCOPE_IDENTIFIER = class MissingScopeIdentifierException extends Exception {
  static code = 'E_MISSING_SCOPE_IDENTIFIER'

  constructor(target: unknown) {
    super(
      `Tried to use "${String(target)}" as a feature scope but does not have a scope identifier`
    )
  }
}
