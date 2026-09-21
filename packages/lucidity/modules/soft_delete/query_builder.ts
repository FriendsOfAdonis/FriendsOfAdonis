import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { E_NOT_SOFT_DELETABLE, E_NOT_THROUGH_RELATION } from './exceptions.ts'
import { isSoftDeletable, isThroughQuery } from './scope.ts'

/**
 * Methods added by the soft delete module to every model query builder.
 */
interface SoftDeleteQueryBuilderContract {
  /**
   * Whether the query includes the trashed rows (`with`) or targets them
   * only (`only`). Trashed rows are hidden when undefined.
   *
   * @internal
   */
  trashedMode?: 'with' | 'only'

  /**
   * Whether a has many through query includes the related rows reached
   * through trashed rows of the through model.
   *
   * @internal
   */
  includeTrashedParents?: boolean

  /**
   * Whether `del()` removes the rows instead of soft deleting them.
   *
   * @internal
   */
  enforceDelete?: boolean

  /**
   * Restores the trashed rows matched by the query.
   */
  restore(): Promise<void>

  /**
   * Permanently removes the rows matched by the query, trashed or not.
   */
  forceDelete(): this

  /**
   * Includes the trashed rows in the query.
   */
  withTrashed(): this

  /**
   * Restricts the query to the trashed rows.
   *
   * @throws {E_NOT_SOFT_DELETABLE} When the model does not use the mixin.
   */
  onlyTrashed(): this
}

/**
 * Methods added by the soft delete module to the has many through query
 * builders and relationship subqueries.
 */
interface WithTrashedParentsContract {
  /**
   * Includes the related rows reached through trashed rows of the through
   * model of a has many through relationship.
   *
   * @throws {E_NOT_THROUGH_RELATION} When the query does not belong to a has
   * many through relationship.
   */
  withTrashedParents(): this
}

declare module '@adonisjs/lucid/types/model' {
  export interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>,
  > extends SoftDeleteQueryBuilderContract {}
}

declare module '@adonisjs/lucid/types/relations' {
  export interface HasManyThroughQueryBuilderContract<
    Related extends LucidModel,
    Result,
  > extends WithTrashedParentsContract {}

  export interface RelationSubQueryBuilderContract<
    Related extends LucidModel,
  > extends WithTrashedParentsContract {}
}

declare module '@adonisjs/lucid/orm' {
  export interface ModelQueryBuilder
    extends SoftDeleteQueryBuilderContract, WithTrashedParentsContract {}
}

/**
 * Makes a bulk write reach the trashed rows, unless the query targets the
 * trashed rows only.
 */
function includeTrashedRows(query: ModelQueryBuilder) {
  if (query.trashedMode !== 'only') query.trashedMode = 'with'
}

ModelQueryBuilder.macro('restore', async function (this: ModelQueryBuilder) {
  if (!isSoftDeletable(this.model)) return
  includeTrashedRows(this)

  await this.update({
    [this.resolveKey('deletedAt')]: null,
  })
})

ModelQueryBuilder.macro('withTrashed', function (this: ModelQueryBuilder) {
  this.trashedMode = 'with'
  return this
})

ModelQueryBuilder.macro('onlyTrashed', function (this: ModelQueryBuilder) {
  if (!isSoftDeletable(this.model)) throw new E_NOT_SOFT_DELETABLE([this.model.name])
  this.trashedMode = 'only'
  return this
})

ModelQueryBuilder.macro('withTrashedParents', function (this: ModelQueryBuilder) {
  if (!isThroughQuery(this)) throw new E_NOT_THROUGH_RELATION([this.model.name])

  this.includeTrashedParents = true
  return this
})

ModelQueryBuilder.macro('del', function (this: ModelQueryBuilder) {
  if (this.enforceDelete === true || !isSoftDeletable(this.model)) return this.forceDelete()

  const format = this.model.query().client.dialect.dateTimeFormat

  return this.update({
    [this.resolveKey('deletedAt')]: DateTime.now().toFormat(format),
  })
})

ModelQueryBuilder.macro('forceDelete', function (this: ModelQueryBuilder) {
  ;(this as any).ensureCanPerformWrites()
  includeTrashedRows(this)
  this.knexQuery.del()
  return this
})
