import { type LucidModel } from '@adonisjs/lucid/types/model'

/**
 * Resolves the value stored in (and matched against) a polymorphic `*_type`
 * column for the given model.
 *
 * Both sides of a polymorphic relation call this helper, so they always agree on
 * the type value without any central registration. By default it is the model
 * table name. Declare a static `morphType` on the model to use a stable alias
 * decoupled from the table name (useful to keep stored values intact across a
 * table rename):
 *
 * @example
 * ```ts
 * class Post extends BaseModel {
 *   static morphType = 'post'
 * }
 * ```
 */
export function resolveMorphType(model: LucidModel): string {
  const explicit = (model as unknown as { morphType?: unknown }).morphType

  if (typeof explicit === 'string' && explicit.length > 0) {
    return explicit
  }

  model.boot()
  return model.table
}
