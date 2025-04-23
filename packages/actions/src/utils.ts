import stringHelpers from '@adonisjs/core/helpers/string'

export function commandName(value: string) {
  return stringHelpers.create(value).removeExtension().removeSuffix('action').dashCase().toString()
}
