import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Flick } from './flick.ts'
import { FeatureScopeable } from './types.ts'
import { BaseFeature } from './base_feature.ts'

export class FeatureResolver<
  Scope extends FeatureScopeable,
  Features extends Record<string, LazyImport<Constructor<BaseFeature>>>,
> {
  private flick: Flick<Features>
  private scope: Scope

  constructor(scope: Scope, flick: Flick<Features>) {
    this.flick = flick
    this.scope = scope
  }

  async isActive<Feature extends keyof Features>(feature: Feature): Promise<boolean> {
    const result = await this.flick.resolve(feature, this.scope)
    return result === true
  }

  async isInactive<Feature extends keyof Features>(feature: Feature): Promise<boolean> {
    return this.isActive(feature).then((res) => !res)
  }

  async match<Feature extends keyof Features, TruthyResult, FalsyResult>(
    feature: Feature,
    matcher: {
      active: () => TruthyResult
      inactive: () => FalsyResult
    }
  ): Promise<TruthyResult | FalsyResult> {
    const isActive = await this.isActive(feature)
    return isActive ? matcher.active() : matcher.inactive()
  }

  /**
   * Returns resolved value from feature flag.
   */
  async value<Feature extends keyof Features>(feature: Feature) {
    return this.flick.resolve(feature, this.scope)
  }

  /**
   * Returns resolved values from list of feature flags.
   */
  async values<T extends ReadonlyArray<keyof Features>>(features: T) {
    return Promise.all(features.map((feature) => this.flick.resolve(feature, this.scope)))
  }
}
