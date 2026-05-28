import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Flick } from './flick.ts'
import { BaseFeature } from './base_feature.ts'
import { ConfigProvider } from '@adonisjs/core/types'

export type FlickConfig<Drivers extends Record<string, ConfigProvider<FlickDriverContract>>> = {
  driver: keyof Drivers
  features: Record<string, LazyImport<Constructor<BaseFeature>>>
  drivers: Drivers
}

export type FlickOptions = {
  features: Record<string, LazyImport<Constructor<BaseFeature>>>
  driver: FlickDriverContract
}

export interface KnownFeatures {}

export type InferFeatures<Features> = Features

export type InferFeatureScope<Feature> =
  Feature extends Constructor<BaseFeature<infer U>> ? U : never

export type InferFeaturesScope<Features> =
  Features extends Record<string, Constructor<BaseFeature<infer U>>> ? U : never

export type InferFeatureResult<Feature> =
  Feature extends Constructor<BaseFeature>
    ? Awaited<ReturnType<InstanceType<Feature>['resolve']>>
    : never

export type InferFeaturesResult<Features extends Record<string, Constructor<BaseFeature>>> = {
  [key in keyof Features]: InferFeatureResult<Features[key]>
}

export type LazyLoaded<T> = T extends LazyImport<infer U> ? U : never

export interface FeatureScopeable {
  toFeatureIdentifier(): string | number
}

export type FlickDriverFactory = () => Promise<FlickDriverContract>

export interface FlickDriverContract {
  set(feature: string, identifier: string | number, value: unknown): Promise<void>
  get(feature: string, identifier: string | number): Promise<unknown>
  delete(feature: string, identifier: string | number): Promise<void>
  purge(features?: string[]): Promise<void>
  flush(): Promise<void>
}

export interface FlickService extends Flick<
  KnownFeatures extends Record<string, LazyImport<Constructor<BaseFeature>>> ? KnownFeatures : never
> {}
