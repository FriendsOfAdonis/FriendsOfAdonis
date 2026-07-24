import { Exception } from '@adonisjs/core/exceptions'

export const E_MODEL_DELETED = class extends Exception {
  static status: number = 410
  static code = 'E_MODEL_DELETED'
  static message = 'Cannot restore a model that has been permanently deleted'
}
