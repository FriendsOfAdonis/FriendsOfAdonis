import { Exception } from '@adonisjs/core/exceptions'

/**
 * The "E_INVALID_PERMISSION_DEFINITION" exception is raised when
 * "definePermissions" receives an invalid definition. For example, a
 * duplicate key, an alias colliding with a key, or a malformed name.
 */
export const E_INVALID_PERMISSION_DEFINITION = class InvalidPermissionDefinitionException extends Exception {
  /**
   * Machine readable error code.
   */
  static code = 'E_INVALID_PERMISSION_DEFINITION'
}

/**
 * The "E_UNKNOWN_PERMISSION" exception is raised when a write receives a
 * value that is neither a defined permission key nor a valid wildcard.
 */
export const E_UNKNOWN_PERMISSION = class UnknownPermissionException extends Exception {
  /**
   * Machine readable error code.
   */
  static code = 'E_UNKNOWN_PERMISSION'

  /**
   * The rejected value, exactly as it was received.
   */
  declare value: unknown

  /**
   * @param value - The value that is not a known permission key or wildcard
   */
  constructor(value: unknown) {
    super(`Unknown permission "${String(value)}". Expected a defined permission key or wildcard`)
    this.value = value
  }
}
