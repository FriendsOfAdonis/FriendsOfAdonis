import stringHelpers from '@adonisjs/core/helpers/string'
import {
  type AsListener,
  type AsController,
  type BaseAction,
  type AsCommand,
} from './base_action.ts'

export function commandName(value: string) {
  return `action:${stringHelpers.create(value).removeExtension().removeSuffix('action').dashCase().toString()}`
}

const LAZY_SPECIFIER_REGEX = /import\('([^']+)'\)/

export function parseLazyImportSpecifier(thunk: string) {
  const name = thunk.match(LAZY_SPECIFIER_REGEX)
  if (!name) {
    return 'closure'
  }

  return name[1]
}

export function implementsAsController<T extends BaseAction>(
  action: T
): action is T & AsController {
  return 'asController' in action
}

export function implementsAsListener<T extends BaseAction>(action: T): action is T & AsListener {
  return 'asListener' in action
}

export function implementsAsCommand<T extends BaseAction>(action: T): action is T & AsCommand {
  return 'asCommand' in action
}
