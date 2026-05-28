import { NormalizeConstructor } from '@adonisjs/core/types/common'
import { BaseModel } from '@adonisjs/lucid/orm'
import { FeatureScopeable } from '../types.ts'

export function HasFeatures<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  return class HasFeaturesImpl extends superclass implements FeatureScopeable {
    toFeatureIdentifier() {
      return this.$primaryKeyValue
    }
  }
}
