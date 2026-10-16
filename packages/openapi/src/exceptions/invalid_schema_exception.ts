import { Exception } from '@adonisjs/core/exceptions'

export class InvalidSchemaException extends Exception {
  static code = 'E_INVALID_SCHEMA'
}
