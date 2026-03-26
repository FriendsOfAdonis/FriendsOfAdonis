import { Exception } from '@adonisjs/core/exceptions'

export class InvalidArgumentError extends Exception {
  static code = 'E_INVALID_ARGUMENT'
}
