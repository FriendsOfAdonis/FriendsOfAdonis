export { morphOne, morphMany, morphTo } from './decorators.ts'
export { resolveMorphType } from './morph_map.ts'

export {
  type MorphTo,
  type MorphOneOptions,
  type MorphManyOptions,
  type MorphOneOrManyOptions,
  type MorphToOptions,
  type MorphQueryHook,
} from './types.ts'

/**
 * Relationship classes, exposed for advanced use (e.g. `instanceof` checks).
 */
export { MorphOne } from './morph_one.ts'
export { MorphMany } from './morph_many.ts'
export { MorphOneOrMany } from './morph_one_or_many.ts'
export { MorphTo as MorphToRelation, MorphToClient, MorphToEagerQuery } from './morph_to.ts'
