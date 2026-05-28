import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Flick } from './flick.ts'
import { BaseFeature } from './base_feature.ts'
import { ConfigProvider } from '@adonisjs/core/types'

export type FlickConfig<
  Features extends Record<string, LazyImport<Constructor<BaseFeature>>>,
  Drivers extends Record<string, ConfigProvider<FlickDriverContract>>,
  Driver extends keyof Drivers,
> = {
  driver: Driver
  features: Features
  drivers: Drivers
}

export type FlickOptions<
  Features extends Record<string, LazyImport<Constructor<BaseFeature>>> = {},
  Driver extends FlickDriverContract = FlickDriverContract,
> = {
  features: Features
  driver: Driver
}

export interface KnownFeatures {}
export interface KnownDriver {}

export type InferFeatures<Config extends ConfigProvider<FlickOptions>> = Awaited<
  ReturnType<Config['resolver']>
>['features']

export type InferFlickDriver<Config extends ConfigProvider<FlickOptions>> = Awaited<
  ReturnType<Config['resolver']>
>['driver']

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
  KnownFeatures extends Record<string, LazyImport<Constructor<BaseFeature>>>
    ? KnownFeatures
    : never,
  KnownDriver extends FlickDriverContract ? KnownDriver : never
> {}
