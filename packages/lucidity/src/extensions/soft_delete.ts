import '../extensions/soft_delete.ts'

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { withSoftDelete } from '../mixins/soft_delete.ts'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

interface SoftDeleteQueryBuilderContract<
  Model extends LucidModel = LucidModel,
  Result = InstanceType<Model>,
> {
  ignoreDeleted?: boolean

  restore(): Promise<void>
  withTrashed(): ModelQueryBuilderContract<Model, Result>
  onlyTrashed(): ModelQueryBuilderContract<Model, Result>
}

interface SoftDeleteQueryBuilder {
  ignoreDeleted?: boolean

  restore(): Promise<void>
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

class User extends compose(BaseModel, withSoftDelete()) {
  @column()
  declare id: string
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

const users = await User.query().withTrashed()
