import { Exception } from '@adonisjs/core/exceptions'

export class ResourceNotFoundException extends Exception {
  static status = 404
  static code = 'E_RESOURCE_NOT_FOUND'

  resource: string

  constructor(resource: string) {
    super(`Resource Not found: The requested resource '${resource}' is not registered`)
    this.resource = resource
  }
}
