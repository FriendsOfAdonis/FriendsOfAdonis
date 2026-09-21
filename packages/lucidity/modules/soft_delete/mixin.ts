import './query_builder.ts'

import { errors } from '@adonisjs/lucid'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, beforeFetch, beforeFind, beforePaginate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { E_MODEL_DELETED } from './exceptions.ts'
import type { ModelWithSoftDeleteClass, ModelWithSoftDeleteRow } from './types.ts'
import { QueryClientContract } from '@adonisjs/lucid/types/database'
import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

/**
 * Persists the given "deletedAt" value along with the auto-update date columns,
 * straight through the model adapter. Every other pending change on the row
 * stays unsaved, and no hooks are run.
 */
async function persistDeletedAt(row: LucidRow, deletedAt: DateTime | null) {
  const Model = row.constructor as LucidModel
  const values: Record<string, unknown> = { deletedAt }

  /**
   * Stamp the auto-update date columns, as `save()` would
   */
  Model.$columnsDefinitions.forEach((definition, attributeName) => {
    const type = definition.meta?.type
    if (!definition.meta?.autoUpdate || (type !== 'date' && type !== 'datetime')) return
    values[attributeName] = DateTime.local()
  })

  const payload = Object.keys(values).reduce<Record<string, unknown>>((result, attributeName) => {
    const definition = Model.$getColumn(attributeName)!
    result[definition.columnName] = definition.prepare
      ? definition.prepare(values[attributeName], attributeName, row)
      : values[attributeName]
    return result
  }, {})

  await Model.$adapter.update(row, payload)

  /**
   * Apply the values only once the write succeeded, and mark them as persisted
   * without touching the originals of the other attributes
   */
  for (const [attributeName, value] of Object.entries(values)) {
    ;(row as any)[attributeName] = value
    row.$original[attributeName] = row.$attributes[attributeName]
  }
}

/**
 * Mixin turning `delete()` into a soft delete that stamps a "deletedAt"
 * timestamp, hiding trashed rows from every read query and adding
 * `restore()` and `forceDelete()` to the model.
 *
 * @example
 * ```ts
 * export default class Post extends compose(BaseModel, SoftDeletable) {}
 * ```
 */
export function SoftDeletable<Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
): ModelWithSoftDeleteClass<Model> {
  class ModelWithSoftDelete extends superclass implements ModelWithSoftDeleteRow {
    /**
     * Whether a force delete is in progress on this row.
     */
    $isForceDeleting = false

    /**
     * Time when the row has been soft deleted.
     */
    @column.dateTime()
    declare deletedAt: DateTime | null

    /**
     * Whether the row has been soft deleted.
     */
    get isTrashed(): boolean {
      return this.deletedAt !== null && this.deletedAt !== undefined
    }

    /**
     * Soft deletes the row by stamping "deletedAt", running the "delete" hooks
     * around the write. Does nothing when the row is already trashed.
     *
     * @throws {E_MODEL_DELETED} When the row has been force deleted.
     */
    async delete() {
      if (this.$isDeleted) throw new errors.E_MODEL_DELETED()
      if (this.isTrashed) return

      const Model = this.constructor as LucidModel
      await Model.$hooks.runner('before:delete').run(this)
      await persistDeletedAt(this, DateTime.local())
      await Model.$hooks.runner('after:delete').run(this)
    }

    /**
     * Same as `delete()` without invoking hooks.
     *
     * @throws {E_MODEL_DELETED} When the row has been force deleted.
     */
    async deleteQuietly() {
      if (this.$isDeleted) throw new errors.E_MODEL_DELETED()
      if (this.isTrashed) return

      await persistDeletedAt(this, DateTime.local())
    }

    /**
     * Restores a trashed row by clearing "deletedAt", running the "restore"
     * hooks around the write. Does nothing when the row is not trashed.
     *
     * @throws {E_MODEL_DELETED} When the row has been force deleted.
     */
    async restore(): Promise<any> {
      if (this.$isDeleted) throw new E_MODEL_DELETED()
      if (!this.isTrashed) return this

      const Model = this.constructor as LucidModel
      await Model.$hooks.runner('before:restore').run(this)
      await persistDeletedAt(this, null)
      await Model.$hooks.runner('after:restore').run(this)
      return this
    }

    /**
     * Same as `restore()` without invoking hooks.
     *
     * @throws {E_MODEL_DELETED} When the row has been force deleted.
     */
    async restoreQuietly(): Promise<any> {
      if (this.$isDeleted) throw new E_MODEL_DELETED()
      if (!this.isTrashed) return this

      await persistDeletedAt(this, null)
      return this
    }

    /**
     * Permanently removes the row, running the "delete" hooks around the
     * query with `$isForceDeleting` set to `true`.
     */
    async forceDelete() {
      this.$isForceDeleting = true
      try {
        await super.delete()
      } finally {
        this.$isForceDeleting = false
      }
    }

    /**
     * Same as `forceDelete()` without invoking hooks.
     */
    async forceDeleteQuietly() {
      this.$isForceDeleting = true
      try {
        await super.deleteQuietly()
      } finally {
        this.$isForceDeleting = false
      }
    }

    /**
     * Returns the query used by the model adapter for the given action. The
     * adapter only deletes a row on a force delete, since soft deletes are
     * written as updates, so the delete query always removes the row.
     */
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

      const query = super.$getQueryFor(action, client)
      if (action === 'delete') query.enforceDelete = true
      return query
    }

    /**
     * Hides trashed rows from fetch and find queries, unless the query opted
     * out with `withTrashed()` or `onlyTrashed()`.
     */
    @beforeFetch()
    @beforeFind()
    static __filterTrashed(query: ModelQueryBuilderContract<Model>) {
      if (query.ignoreDeleted === true) return

      const deletedAtColumn = query.model.$getColumn('deletedAt')
      if (!deletedAtColumn) return

      query.whereNull(`${query.model.table}.${deletedAtColumn.columnName}`)
    }

    /**
     * Hides trashed rows from paginated queries and their count query.
     */
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
