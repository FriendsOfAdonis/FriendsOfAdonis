import stringHelpers from '@adonisjs/core/helpers/string'
import { type BaseAction } from './base_action.ts'
import { type AsControllerContract } from './mixins/as_controller.ts'
import { type AsListenerContract } from './mixins/as_listener.ts'
import { type AsCommandContract } from './mixins/as_command.ts'

/**
 * Generates a CLI command name from an action class name.
 * Converts "CreateUserAction" to "action:create-user".
 */
export function generateCommandName(value: string) {
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
): action is T & AsControllerContract {
  return 'asController' in action
}

/**
 * Type guard to check if an action implements AsListener.
 */
export function implementsAsListener<T extends BaseAction>(
  action: T
): action is T & AsListenerContract {
  return 'asListener' in action
}

/**
 * Type guard to check if an action implements AsCommand.
 */
export function implementsAsCommand<T extends BaseAction>(
  action: T
): action is T & AsCommandContract {
  return 'asCommand' in action
}
