import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Flick } from './flick.ts'
import { FeatureScopeable, InferFeatureResult, LazyLoaded } from './types.ts'
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

  /**
   * Resolves a feature flag and returns whether it is active (truthy) for the scope.
   *
   * @example
   * flick.for(user).isActive('new_checkout')
   */
  async isActive<Feature extends keyof Features>(feature: Feature): Promise<boolean> {
    const result = await this.flick.resolve(feature, this.scope)
    return Boolean(result)
  }

  /**
   * Resolves a feature flag and returns whether it is inactive (falsy) for the scope.
   *
   * @example
   * flick.for(user).isInactive('new_checkout')
   */
  async isInactive<Feature extends keyof Features>(feature: Feature): Promise<boolean> {
    const result = await this.flick.resolve(feature, this.scope)
    return !result
  }

  /**
   * Returns `true` only when every given feature flag is active for the scope.
   *
   * @example
   * flick.for(user).allActive(['new_checkout', 'beta_banner'])
   */
  async allActive<Feature extends keyof Features>(features: Feature[]): Promise<boolean> {
    const values = await this.values(features)
    return values.every((value) => Boolean(value))
  }

  /**
   * Returns `true` when at least one of the given feature flags is active for the scope.
   *
   * @example
   * flick.for(user).someActive(['new_checkout', 'beta_banner'])
   */
  async someActive<Feature extends keyof Features>(features: Feature[]): Promise<boolean> {
    const values = await this.values(features)
    return values.some((value) => Boolean(value))
  }

  /**
   * Returns `true` only when every given feature flag is inactive for the scope.
   *
   * @example
   * flick.for(user).allInactive(['new_checkout', 'beta_banner'])
   */
  async allInactive<Feature extends keyof Features>(features: Feature[]): Promise<boolean> {
    const values = await this.values(features)
    return values.every((value) => !value)
  }

  /**
   * Returns `true` when at least one of the given feature flags is inactive for the scope.
   *
   * @example
   * flick.for(user).someInactive(['new_checkout', 'beta_banner'])
   */
  async someInactive<Feature extends keyof Features>(features: Feature[]): Promise<boolean> {
    const values = await this.values(features)
    return values.some((value) => !value)
  }

  /**
   * Resolves a feature flag and invokes the matching branch, returning its result.
   *
   * @example
   * flick.for(user).match('new_checkout', {
   *   active: () => renderNewCheckout(),
   *   inactive: () => renderLegacyCheckout(),
   * })
   */
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
   *
   * @example
   * flick.for(user).value('new_checkout')
   */
  async value<Feature extends keyof Features>(feature: Feature) {
    return this.flick.resolve(feature, this.scope)
  }

  /**
   * Returns resolved values from list of feature flags.
   *
   * @example
   * flick.for(user).values(['new_checkout', 'beta_banner'])
   */
  async values<const T extends ReadonlyArray<keyof Features>>(
    features: T
  ): Promise<{
    [key in keyof T]: InferFeatureResult<LazyLoaded<Features[T[key]]>>
  }> {
    const resolved = await Promise.all(
      features.map((feature) => this.flick.resolve(feature, this.scope))
    )

    return resolved as any
  }

  /**
   * Removes the cached value of the feature for the scope, forcing the next
   * resolution to re-evaluate the feature.
   *
   * @example
   * flick.for(user).clear('new_checkout')
   */
  async clear<Feature extends keyof Features>(feature: Feature) {
    return this.flick.clear(feature, this.scope)
  }

  /**
   * Stores an explicit value for the feature on the scope, overriding its
   * `resolve` until the value is cleared.
   *
   * @example
   * flick.for(user).define('checkout_variant', 'experimental')
   */
  async define<Feature extends keyof Features>(
    feature: Feature,
    value: InferFeatureResult<LazyLoaded<Features[Feature]>>
  ) {
    return this.flick.define(feature, this.scope, value)
  }

  /**
   * Turns the feature on for the scope by storing `true`.
   *
   * @example
   * flick.for(user).activate('new_checkout')
   */
  async activate<Feature extends keyof Features>(feature: Feature) {
    return this.flick.activate(feature, this.scope)
  }

  /**
   * Turns the feature off for the scope by storing `false`.
   *
   * @example
   * flick.for(user).deactivate('new_checkout')
   */
  async deactivate<Feature extends keyof Features>(feature: Feature) {
    return this.flick.deactivate(feature, this.scope)
  }
}
