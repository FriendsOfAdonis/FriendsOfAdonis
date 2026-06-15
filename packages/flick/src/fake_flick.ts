import { AssertionError } from 'node:assert'
import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { BaseFeature } from './base_feature.ts'
import { FeatureScopeable, InferFeatureResult, InferFeatureScope, LazyLoaded } from './types.ts'

type ResolveCall<Features extends Record<string, LazyImport<Constructor<BaseFeature>>>> = {
  feature: keyof Features
  identifier: string | number
}

/**
 * Test double returned by `flick.fake()`. Intercepts feature resolution to
 * return configured values, records every resolution for later assertions, and
 * restores the real resolver on `restore()` (or when disposed via `using`).
 */
export class FakeFlick<Features extends Record<string, LazyImport<Constructor<BaseFeature>>>> {
  #overrides = new Map<keyof Features, unknown>()
  #passthrough: (feature: keyof Features, scope: FeatureScopeable) => Promise<unknown>
  #onRestore: () => void
  #calls: ResolveCall<Features>[] = []

  constructor(
    passthrough: (feature: keyof Features, scope: FeatureScopeable) => Promise<unknown>,
    onRestore: () => void
  ) {
    this.#passthrough = passthrough
    this.#onRestore = onRestore
  }

  /**
   * Overrides the value returned by a feature.
   */
  override<Feature extends keyof Features>(
    feature: Feature,
    value:
      | InferFeatureResult<LazyLoaded<Features[Feature]>>
      | ((
          scope: InferFeatureScope<LazyLoaded<Features[Feature]>>
        ) => InferFeatureResult<LazyLoaded<Features[Feature]>>)
  ): this {
    this.#overrides.set(feature, value)
    return this
  }

  /**
   * Records the resolution and returns the faked value when the feature has an
   * override, otherwise delegates to the real resolution path.
   */
  async resolve<Feature extends keyof Features>(
    feature: Feature,
    scope: FeatureScopeable
  ): Promise<unknown> {
    this.#calls.push({ feature, identifier: scope.toFeatureIdentifier() })

    if (this.#overrides.has(feature)) {
      const override = this.#overrides.get(feature)
      if (typeof override === 'function') {
        return (override as (scope: FeatureScopeable) => unknown)(scope)
      }
      return override
    }

    return this.#passthrough(feature, scope)
  }

  /**
   * Asserts the given feature was resolved at least once.
   */
  assertResolved(feature: keyof Features): void {
    if (!this.#calls.some((call) => call.feature === feature)) {
      throw new AssertionError({
        message: `Expected feature "${String(feature)}" to have been resolved, but it never was`,
      })
    }
  }

  /**
   * Asserts the given feature was never resolved.
   */
  assertNotResolved(feature: keyof Features): void {
    if (this.#calls.some((call) => call.feature === feature)) {
      throw new AssertionError({
        message: `Expected feature "${String(feature)}" not to have been resolved, but it was`,
      })
    }
  }

  /**
   * Asserts the given feature was resolved for the given scope.
   */
  assertResolvedFor(feature: keyof Features, scope: FeatureScopeable): void {
    const identifier = scope.toFeatureIdentifier()
    const matched = this.#calls.some(
      (call) => call.feature === feature && call.identifier === identifier
    )
    if (!matched) {
      throw new AssertionError({
        message: `Expected feature "${String(feature)}" to have been resolved for "${identifier}", but it was not`,
      })
    }
  }

  /**
   * Restores the real resolution path on the originating Flick instance.
   */
  restore(): void {
    this.#onRestore()
  }

  [Symbol.dispose](): void {
    this.restore()
  }
}
