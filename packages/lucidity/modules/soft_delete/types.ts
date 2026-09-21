import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export type ModelWithSoftDeleteRow = {
  /**
   * Whether a force delete is in progress on this row. It is `true` only
   * while `forceDelete()` or `forceDeleteQuietly()` runs, so delete hooks
   * can tell a force delete from a soft delete.
   */
  $isForceDeleting: boolean

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
   * Same as `restore()` without invoking hooks.
   */
  restoreQuietly<T>(this: T): Promise<T>

  /**
   * Force delete the row.
   */
  forceDelete(): Promise<void>

  /**
   * Same as `forceDelete()` without invoking hooks.
   */
  forceDeleteQuietly(): Promise<void>
}

export type ModelWithSoftDeleteClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): ModelWithSoftDeleteRow
}
