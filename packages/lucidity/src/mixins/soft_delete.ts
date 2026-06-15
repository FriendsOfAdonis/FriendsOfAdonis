import '../extensions/soft_delete.ts'

import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, beforeFetch, beforeFind, beforePaginate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { E_MODEL_DELETED } from '../exceptions.ts'
import { QueryClientContract } from '@adonisjs/lucid/types/database'
import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export type ModelWithSoftDeleteRow = {
  /**
   * Wether this row is marked to be force deleted.
   */
  $isForceDeleted: boolean

  /**
   * Time when the row has been soft deleted.
   */
  deletedAt: DateTime | null

  /**
   * Wether the row has been soft deleted.
   */
  get isTrashed(): boolean

  /**
   * Restore trashed row by setting
   * deletedAt to null.
   */
  restore<T>(this: T): Promise<T>

  /**
   * Force delete the row.
   */
  forceDelete(): Promise<void>
}

export type ModelWithSoftDeleteClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): ModelWithSoftDeleteRow
}

export function SoftDeletable<Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
): ModelWithSoftDeleteClass<Model> {
  class ModelWithSoftDelete extends superclass implements ModelWithSoftDeleteRow {
    $isForceDeleted = false

    @column.dateTime()
    declare deletedAt: DateTime | null

    get isTrashed(): boolean {
      return this.deletedAt !== null && this.deletedAt !== undefined
    }

    async delete() {
      await super.delete()
      this.$isDeleted = this.$isForceDeleted
    }

    async restore(): Promise<any> {
      if (this.$isDeleted) {
        throw new E_MODEL_DELETED()
      }

      if (!this.isTrashed) {
        return this
      }

      this.deletedAt = null
      return this.save()
    }

    async forceDelete() {
      this.$isForceDeleted = true
      await this.delete()
    }

    $getQueryFor(
      action: 'insert',
      client: QueryClientContract
    ): ReturnType<QueryClientContract['insertQuery']>
    $getQueryFor(
      action: 'update' | 'delete' | 'refresh',
      client: QueryClientContract
    ): ModelQueryBuilderContract<LucidModel>
    $getQueryFor(action: 'insert' | 'update' | 'delete' | 'refresh', client: QueryClientContract) {
      if (action === 'insert') return super.$getQueryFor(action, client)
      if (action !== 'delete') return super.$getQueryFor(action, client)

      const query = super.$getQueryFor(action, client)

      if (this.$isForceDeleted === true) {
        query.enforceDelete = true
        return query
      }

      const softDelete = async () => {
        this.deletedAt = DateTime.local()
        await this.save()
      }

      return { ...super.$getQueryFor(action, client), del: softDelete, delete: softDelete }
    }

    @beforeFetch()
    @beforeFind()
    static __filterTrashed(query: ModelQueryBuilderContract<Model>) {
      if (query.ignoreDeleted === true) return

      const deletedAtColumn = query.model.$getColumn('deletedAt')
      if (!deletedAtColumn) return

      query.whereNull(`${query.model.table}.${deletedAtColumn.columnName}`)
    }

    @beforePaginate()
    static __filterTrashedPaginate([countQuery, query]: [
      ModelQueryBuilderContract<Model>,
      ModelQueryBuilderContract<Model>,
    ]) {
      if (query.ignoreDeleted === true) return

      const deletedAtColumn = query.model.$getColumn('deletedAt')
      if (!deletedAtColumn) return

      countQuery.ignoreDeleted = true
      countQuery.whereNull(`${query.model.table}.${deletedAtColumn.columnName}`)
    }
  }

  return ModelWithSoftDelete
}
