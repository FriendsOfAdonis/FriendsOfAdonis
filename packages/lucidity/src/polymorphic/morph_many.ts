import { type LucidModel, type LucidRow } from '@adonisjs/lucid/types/model'
import { MorphOneOrMany } from './morph_one_or_many.ts'
import { MorphManyClient } from './query_client.ts'

/**
 * `morphMany` relationship: the parent model has many polymorphic children.
 *
 * @example
 * ```ts
 * // comments: id, body, commentable_type, commentable_id
 * class Post extends BaseModel {
 *   \@morphMany(() => Comment)
 *   declare comments: HasMany<typeof Comment>
 * }
 * ```
 */
export class MorphMany extends MorphOneOrMany {
  readonly type = 'hasMany' as const
  readonly single = false

  client(parent: LucidRow, client: any): MorphManyClient {
    this.boot()
    return new MorphManyClient(this, parent, client)
  }

  clone(model: LucidModel): MorphMany {
    return new MorphMany(this.relationName, this.relatedModel, { ...this.options }, model)
  }
}
