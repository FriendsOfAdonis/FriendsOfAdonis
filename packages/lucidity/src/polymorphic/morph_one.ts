import { type LucidModel, type LucidRow } from '@adonisjs/lucid/types/model'
import { MorphOneOrMany } from './morph_one_or_many.ts'
import { MorphOneOrManyClient } from './query_client.ts'

/**
 * `morphOne` relationship: the parent model has exactly one polymorphic child.
 *
 * @example
 * ```ts
 * // images: id, url, imageable_type, imageable_id
 * class Post extends BaseModel {
 *   \@morphOne(() => Image)
 *   declare image: HasOne<typeof Image> | null
 * }
 * ```
 */
export class MorphOne extends MorphOneOrMany {
  readonly type = 'hasOne' as const
  readonly single = true

  client(parent: LucidRow, client: any): MorphOneOrManyClient {
    this.boot()
    return new MorphOneOrManyClient(this, parent, client)
  }

  clone(model: LucidModel): MorphOne {
    return new MorphOne(this.relationName, this.relatedModel, { ...this.options }, model)
  }
}
