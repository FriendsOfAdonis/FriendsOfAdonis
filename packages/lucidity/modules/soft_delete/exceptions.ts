import { createError, Exception } from '@adonisjs/core/exceptions'

export const E_MODEL_DELETED = class extends Exception {
  static status: number = 410
  static code = 'E_MODEL_DELETED'
  static message = 'Cannot restore a model that has been permanently deleted'
}

/**
 * The "E_NOT_SOFT_DELETABLE" exception is raised when trashed rows are
 * queried on a model that does not use the `SoftDeletable` mixin.
 */
export const E_NOT_SOFT_DELETABLE = createError<[model: string]>(
  'Cannot query trashed rows of "%s" model, since it does not use the SoftDeletable mixin',
  'E_NOT_SOFT_DELETABLE',
  500
)

/**
 * The "E_NOT_THROUGH_RELATION" exception is raised when the trashed parents
 * are included in a query that does not belong to a has many through
 * relationship.
 */
export const E_NOT_THROUGH_RELATION = createError<[model: string]>(
  'Cannot include trashed parents in a "%s" query, since it does not belong to a has many through relationship',
  'E_NOT_THROUGH_RELATION',
  500
)
