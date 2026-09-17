import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

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
