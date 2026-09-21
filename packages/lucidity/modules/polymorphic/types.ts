import { type LucidModel } from '@adonisjs/lucid/types/model'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * A query builder passed to a polymorphic `onQuery` hook. Kept loose on purpose:
 * morph relations issue queries against a related model whose concrete type is
 * only known at runtime.
 */
export type MorphQueryHook = (query: any) => void

/**
 * Opaque type used to declare the property of a `morphTo` relationship.
 *
 * It brands the property as a `belongsTo` relation, so it is recognized by
 * Lucid's relation helpers (`preload`, `related`, serialization, ...) while
 * typing the resolved value as the union of every candidate model instance.
 *
 * @example
 * ```ts
 * \@morphTo(() => [Post, Video])
 * declare imageable: MorphTo<[typeof Post, typeof Video]> | null
 * ```
 */
export type MorphTo<Models extends readonly [LucidModel, ...LucidModel[]]> = BelongsTo<
  Models[number]
>

/**
 * Options shared by the `morphOne` and `morphMany` relationships. They are
 * defined on the parent model: the one that owns the polymorphic children.
 */
export interface MorphOneOrManyOptions {
  /**
   * Polymorphic name shared by the `*_type` / `*_id` columns on the related
   * model (e.g. `'imageable'` maps to `imageable_type` + `imageable_id`).
   *
   * When omitted, the name is inferred from the related model's `morphTo`
   * relationship that points back to this model.
   */
  morphName?: string

  /**
   * Attribute on the parent model matched against the morph id column.
   *
   * @default the parent model primary key
   */
  localKey?: string

  /**
   * Key used when serializing the relationship. `null` excludes it.
   *
   * @default the relationship property name
   */
  serializeAs?: string | null

  /**
   * Hook to add constraints to every query issued for this relationship.
   */
  onQuery?: MorphQueryHook
}

export interface MorphOneOptions extends MorphOneOrManyOptions {}
export interface MorphManyOptions extends MorphOneOrManyOptions {}

/**
 * Options accepted by the `morphTo` relationship, defined on the child model:
 * the one that holds the `*_type` / `*_id` columns.
 */
export interface MorphToOptions {
  /**
   * Polymorphic name used to derive the `*_type` / `*_id` attributes on this
   * model.
   *
   * @default the relationship property name
   */
  morphName?: string

  /**
   * Key used when serializing the relationship. `null` excludes it.
   *
   * @default the relationship property name
   */
  serializeAs?: string | null

  /**
   * Hook to add constraints to every query issued for this relationship. It runs
   * once per resolved parent type during eager loading.
   */
  onQuery?: MorphQueryHook
}
