import { NormalizeConstructor } from '@adonisjs/core/types/common'
import { BaseModel } from '@adonisjs/lucid/orm'
import { FeatureScopeable } from '../types.ts'
import { E_MISSING_SCOPE_IDENTIFIER } from '../exceptions.ts'

export type ModelWithFeatures<Model extends NormalizeConstructor<typeof BaseModel>> = Model & {
  new (...args: any[]): FeatureScopeable
}

/**
 * Implements `FeatureScopeable` on a Lucid Model.
 *
 * @example
 * export default class User extends compose(BaseModel, HasFeatures) {}
 */
export function HasFeatures<T extends NormalizeConstructor<typeof BaseModel>>(
  superclass: T
): ModelWithFeatures<T> {
  return class HasFeaturesImpl extends superclass implements FeatureScopeable {
    toFeatureIdentifier() {
      if (!this.$primaryKeyValue) {
        throw new E_MISSING_SCOPE_IDENTIFIER(this.constructor.name)
      }

      return this.$primaryKeyValue
    }
  }
}
