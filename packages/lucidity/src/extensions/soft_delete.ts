import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

interface SoftDeleteQueryBuilderContract<
  Model extends LucidModel = LucidModel,
  Result = InstanceType<Model>,
> {
  /** @internal */
  ignoreDeleted?: boolean
  /** @internal */
  enforceDelete?: boolean

  restore(): Promise<void>
  forceDelete(): ModelQueryBuilderContract<Model, Result>
  withTrashed(): ModelQueryBuilderContract<Model, Result>
  onlyTrashed(): ModelQueryBuilderContract<Model, Result>
}

interface SoftDeleteQueryBuilder {
  /** @internal */
  ignoreDeleted?: boolean
  /** @internal */
  enforceDelete?: boolean

  restore(): Promise<void>
  forceDelete(): ModelQueryBuilder
  withTrashed(): ModelQueryBuilder
  onlyTrashed(): ModelQueryBuilder
}

declare module '@adonisjs/lucid/types/model' {
  export interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>,
  > extends SoftDeleteQueryBuilderContract<Model, Result> {}
}

declare module '@adonisjs/lucid/orm' {
  export interface ModelQueryBuilder extends SoftDeleteQueryBuilder {}
}

ModelQueryBuilder.macro('restore', async function (this: ModelQueryBuilder) {
  const deletedAtColumn = this.model.$getColumn('deletedAt')
  if (!deletedAtColumn) return

  await this.update({
    [deletedAtColumn.columnName]: null,
  })
})

ModelQueryBuilder.macro('withTrashed', function (this: ModelQueryBuilder) {
  this.ignoreDeleted = true
  return this
})

ModelQueryBuilder.macro('onlyTrashed', function (this: ModelQueryBuilder) {
  this.ignoreDeleted = true

  const deletedAtColumn = this.model.$getColumn('deletedAt')
  if (!deletedAtColumn) return this

  return this.whereNotNull(`${this.model.table}.${deletedAtColumn.columnName}`)
})

ModelQueryBuilder.macro('del', function (this: ModelQueryBuilder) {
  if (this.enforceDelete === true) return this.forceDelete()
  const deletedAtColumn = this.model.$getColumn('deletedAt')
  if (!deletedAtColumn) return this.forceDelete()

  const format = this.model.query().client.dialect.dateTimeFormat

  return this.update({
    [this.resolveKey('deletedAt')]: DateTime.now().toFormat(format),
  })
})

ModelQueryBuilder.macro('forceDelete', function (this: ModelQueryBuilder) {
  ;(this as any).ensureCanPerformWrites()
  this.knexQuery.del()
  return this
})
