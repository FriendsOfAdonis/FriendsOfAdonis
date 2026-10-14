import { Exception } from '@adonisjs/core/exceptions'

/**
 * The "E_INVALID_PERMISSION_DEFINITION" exception is raised when
 * "definePermissions" receives an invalid definition. For example, a
 * malformed name, an action at the root, or an alias or inactive path
 * that does not match the tree.
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

/**
 * The "E_INVALID_ROLE_DEFINITION" exception is raised when "defineRoles"
 * receives an invalid definition. For example, a malformed role name or
 * a grant that is not a defined permission key or wildcard.
 */
export const E_INVALID_ROLE_DEFINITION = class InvalidRoleDefinitionException extends Exception {
  /**
   * Machine readable error code.
   */
  static code = 'E_INVALID_ROLE_DEFINITION'
}

/**
 * The "E_UNKNOWN_ROLE" exception is raised when a write receives a value
 * that is not the name of a role defined with "defineRoles".
 */
export const E_UNKNOWN_ROLE = class UnknownRoleException extends Exception {
  /**
   * Machine readable error code.
   */
  static code = 'E_UNKNOWN_ROLE'

  /**
   * The rejected value, exactly as it was received.
   */
  declare value: unknown

  /**
   * @param value - The value that is not a defined role name
   */
  constructor(value: unknown) {
    super(`Unknown role "${String(value)}". Expected a role defined with "defineRoles"`)
    this.value = value
  }
}
