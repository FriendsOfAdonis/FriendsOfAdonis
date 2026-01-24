import stringHelpers from '@adonisjs/core/helpers/string'
import { type BaseAction } from './base_action.ts'
import { type AsCommand, type AsController, type AsListener } from './types.ts'

/**
 * Generates a CLI command name from an action class name.
 * Converts "CreateUserAction" to "action:create-user".
 */
export function commandName(value: string) {
  return `action:${stringHelpers.create(value).removeExtension().removeSuffix('action').dashCase().toString()}`
}

const LAZY_SPECIFIER_REGEX = /import\('([^']+)'\)/

/**
 * Extracts the import path from a lazy import function string.
 * Used for naming handlers in routes and events.
 */
export function parseLazyImportSpecifier(thunk: string) {
  const name = thunk.match(LAZY_SPECIFIER_REGEX)
  if (!name) {
    return 'closure'
  }

  return name[1]
}

/**
 * Type guard to check if an action implements AsController.
 */
export function implementsAsController<T extends BaseAction>(
  action: T
): action is T & AsController {
  return 'asController' in action
}

/**
 * Type guard to check if an action implements AsListener.
 */
export function implementsAsListener<T extends BaseAction>(action: T): action is T & AsListener {
  return 'asListener' in action
}

/**
 * Type guard to check if an action implements AsCommand.
 */
export function implementsAsCommand<T extends BaseAction>(action: T): action is T & AsCommand {
  return 'asCommand' in action
}
