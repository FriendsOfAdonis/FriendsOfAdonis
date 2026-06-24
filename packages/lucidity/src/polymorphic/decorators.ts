import { type LucidModel, type OptionalTypedDecorator } from '@adonisjs/lucid/types/model'
import { type HasMany, type HasOne } from '@adonisjs/lucid/types/relations'
import { MorphOne } from './morph_one.ts'
import { MorphMany } from './morph_many.ts'
import { MorphTo as MorphToRelation } from './morph_to.ts'
import {
  type MorphManyOptions,
  type MorphOneOptions,
  type MorphOneOrManyOptions,
  type MorphTo,
  type MorphToOptions,
} from './types.ts'

function normalizeOptions(
  nameOrOptions?: string | MorphOneOrManyOptions
): MorphOneOrManyOptions {
  if (typeof nameOrOptions === 'string') {
    return { morphName: nameOrOptions }
  }
  return nameOrOptions ?? {}
}

function registerRelation(target: any, property: string | symbol, relation: any): void {
  const Model = target.constructor as LucidModel
  Model.boot()
  Model.$relationsDefinitions.set(property as string, relation)
}

/**
 * Defines a `morphOne` relationship: the parent model has one polymorphic child.
 *
 * The morph name (and therefore the `*_type` / `*_id` columns on the related
 * model) is inferred from the related model's `morphTo` relationship, or can be
 * passed explicitly.
 *
 * @example
 * ```ts
 * \@morphOne(() => Image)
 * declare image: HasOne<typeof Image> | null
 *
 * \@morphOne(() => Image, 'imageable')
 * declare image: HasOne<typeof Image> | null
 * ```
 */
export function morphOne<RelatedModel extends LucidModel>(
  relatedModel: () => RelatedModel,
  nameOrOptions?: string | MorphOneOptions
): OptionalTypedDecorator<HasOne<RelatedModel> | null> {
  return function decorateAsMorphOne(target, property) {
    const relation = new MorphOne(
      property as string,
      relatedModel,
      normalizeOptions(nameOrOptions),
      target.constructor as LucidModel
    )
    registerRelation(target, property, relation)
  }
}

/**
 * Defines a `morphMany` relationship: the parent model has many polymorphic
 * children.
 *
 * @example
 * ```ts
 * \@morphMany(() => Comment)
 * declare comments: HasMany<typeof Comment>
 *
 * \@morphMany(() => Comment, 'commentable')
 * declare comments: HasMany<typeof Comment>
 * ```
 */
export function morphMany<RelatedModel extends LucidModel>(
  relatedModel: () => RelatedModel,
  nameOrOptions?: string | MorphManyOptions
): OptionalTypedDecorator<HasMany<RelatedModel>> {
  return function decorateAsMorphMany(target, property) {
    const relation = new MorphMany(
      property as string,
      relatedModel,
      normalizeOptions(nameOrOptions),
      target.constructor as LucidModel
    )
    registerRelation(target, property, relation)
  }
}

/**
 * Defines a `morphTo` relationship: the child model belongs to one of several
 * parent models. The `*_type` / `*_id` columns are derived from the property
 * name (e.g. `imageable` maps to `imageableType` + `imageableId`).
 *
 * @example
 * ```ts
 * \@morphTo(() => [Post, Video])
 * declare imageable: MorphTo<[typeof Post, typeof Video]> | null
 * ```
 */
export function morphTo<const Models extends readonly [LucidModel, ...LucidModel[]]>(
  models: () => Models,
  options?: MorphToOptions
): OptionalTypedDecorator<MorphTo<Models> | null> {
  return function decorateAsMorphTo(target, property) {
    const relation = new MorphToRelation(
      property as string,
      models as unknown as () => LucidModel[],
      options ?? {},
      target.constructor as LucidModel
    )
    registerRelation(target, property, relation)
  }
}
