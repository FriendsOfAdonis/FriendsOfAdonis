import { errors } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'

export class InvalidSchemaException extends Exception {
  static code = 'E_INVALID_SCHEMA'
}

errors.E_HTTP_REQUEST_ABORTED
