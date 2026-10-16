import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { FeatureResolver } from './feature_resolver.ts'
import { ContainerResolver } from '@adonisjs/core/container'
import { ContainerBindings } from '@adonisjs/core/types'
import { BaseFeature } from './base_feature.ts'
import { FakeFlick } from './fake_flick.ts'
import { FeatureScopeable, FlickDriverContract, InferFeatureResult, LazyLoaded } from './types.ts'

export class Flick<
  Features extends Record<string, LazyImport<Constructor<BaseFeature>>>,
  KnownDriver extends FlickDriverContract = FlickDriverContract,
> {
  #resolver: ContainerResolver<ContainerBindings>
  #features: Record<string, LazyImport<Constructor<BaseFeature>>>
  #driver: KnownDriver
  #fake?: FakeFlick<Features>

  constructor(
    features: Features,
    resolver: ContainerResolver<ContainerBindings>,
    driver: KnownDriver
  ) {
    this.#resolver = resolver
    this.#features = features
    this.#driver = driver
  }

  get driver(): KnownDriver {
    return this.#driver
  }

  /**
   * The names of every registered feature.
   */
  get features(): string[] {
    return Object.keys(this.#features)
  }

  /**
   * Creates a resolver bound to the given scope, exposing the feature query helpers.
   *
   * @example
   * flick.for(user).isActive('new_checkout')
   */
  for<Scope extends FeatureScopeable>(scope: Scope) {
    return new FeatureResolver<Scope, Features>(scope, this)
  }

  /**
   * Resolves a single feature for the given scope.
   *
   * Runs the feature's optional `before` hook (which may short-circuit), then
   * returns the driver-cached value when present, otherwise evaluates the
   * feature's `resolve` and caches the result before returning it.
   *
   * @example
   * await flick.resolve('new_checkout', user)
   */
  async resolve<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<InferFeatureResult<LazyLoaded<Features[Feature]>>> {
    if (this.#fake) {
      return this.#fake.resolve(feature as string, scope) as Promise<
        InferFeatureResult<LazyLoaded<Features[Feature]>>
      >
    }

    return this.#resolveReal(feature, scope)
  }

  async #resolveReal<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<InferFeatureResult<LazyLoaded<Features[Feature]>>> {
    const li = this.#features[feature as string]
    const { default: Constructor } = await li()
    const instance = await this.#resolver.make(Constructor)

    if (instance.before) {
      const shortSircuit: any = await instance.before(scope)
      if (shortSircuit !== undefined) return shortSircuit
    }

    const identifier = scope.toFeatureIdentifier()
    const cached: any = await this.#driver.get(feature as string, identifier)
    if (cached !== undefined) return cached

    const result: any = await instance.resolve(scope)
    await this.#driver.set(feature as string, identifier, result)

    return result
  }

  /**
   * Stores an explicit value for the feature and scope, bypassing the feature's
   * `resolve`. Because `resolve` returns the cached value when present, this acts
   * as a persistent per-scope override until `clear` (or `purge`) removes it.
   *
   * @example
   * await flick.define('checkout_variant', user, 'experimental')
   */
  async define<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope,
    value: InferFeatureResult<LazyLoaded<Features[Feature]>>
  ): Promise<void> {
    await this.#driver.set(feature as string, scope.toFeatureIdentifier(), value)
  }

  /**
   * Turns the feature on for the scope by storing `true`. Shorthand for
   * `define(feature, scope, true)`.
   *
   * @example
   * await flick.activate('new_checkout', user)
   */
  async activate<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<void> {
    return this.define(feature, scope, true as any)
  }

  /**
   * Turns the feature off for the scope by storing `false`. Shorthand for
   * `define(feature, scope, false)`.
   *
   * @example
   * await flick.deactivate('new_checkout', user)
   */
  async deactivate<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<void> {
    return this.define(feature, scope, false as any)
  }

  /**
   * Removes the cached value for the feature and scope. The next `resolve` will
   * re-evaluate the feature instead of returning a stored value.
   *
   * @example
   * await flick.clear('new_checkout', user)
   */
  async clear<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<void> {
    await this.#driver.delete(feature as string, scope.toFeatureIdentifier())
  }

  /**
   * Removes the cached values of the given features across every scope, or of
   * all features when none are given.
   *
   * @example
   * await flick.purge(['new_checkout']) // a single feature
   * await flick.purge()                 // everything
   */
  async purge(features?: string[]): Promise<void> {
    await this.#driver.purge(features)
  }

  /**
   * Replaces feature resolution with faked values for testing. Features listed
   * in `overrides` return the given value (or `(scope) => value` result);
   * everything else falls through to real resolution. Call `restore()` (or use
   * `using`) to undo.
   *
   * @example
   * using fake = flick.fake().override('new_checkout', 'hello')
   * await flick.for(user).isActive('new_checkout') // 'hello'
   * fake.assertResolved('new_checkout')
   */
  fake(): FakeFlick<Features> {
    this.restore()
    this.#fake = new FakeFlick<Features>(
      (feature, scope) => this.#resolveReal(feature as keyof Features, scope),
      () => this.restore()
    )
    return this.#fake
  }

  /**
   * Restores real feature resolution after `fake()`.
   */
  restore(): void {
    this.#fake = undefined
  }
}
