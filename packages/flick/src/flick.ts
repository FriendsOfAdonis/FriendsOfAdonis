import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { FeatureResolver } from './feature_resolver.ts'
import { ContainerResolver } from '@adonisjs/core/container'
import { ContainerBindings } from '@adonisjs/core/types'
import { BaseFeature } from './base_feature.ts'
import { FeatureScopeable, FlickDriverContract, InferFeatureResult, LazyLoaded } from './types.ts'

export class Flick<Features extends Record<string, LazyImport<Constructor<BaseFeature>>>> {
  private resolver: ContainerResolver<ContainerBindings>
  private features: Record<string, LazyImport<Constructor<BaseFeature>>>
  private driver: FlickDriverContract

  constructor(
    features: Features,
    resolver: ContainerResolver<ContainerBindings>,
    driver: FlickDriverContract
  ) {
    this.resolver = resolver
    this.features = features
    this.driver = driver
  }

  for<Scope extends FeatureScopeable>(scope: Scope) {
    return new FeatureResolver<Scope, Features>(scope, this)
  }

  async resolve<Feature extends keyof Features, Scope extends FeatureScopeable>(
    feature: Feature,
    scope: Scope
  ): Promise<InferFeatureResult<LazyLoaded<Features[Feature]>>> {
    const li = this.features[feature as any] // TODO: `keyof Features` does not seem to work
    const { default: Constructor } = await li()
    const instance = await this.resolver.make(Constructor)

    if (instance.before) {
      const shortSircuit: any = await instance.before(scope)
      if (shortSircuit !== undefined) return shortSircuit
    }

    const identifier = scope.toFeatureIdentifier()
    const cached: any = await this.driver.get(feature as string, identifier)
    if (cached) return cached

    const result: any = await instance.resolve(scope)
    await this.driver.set(feature as string, identifier, result)

    return result
  }
}
