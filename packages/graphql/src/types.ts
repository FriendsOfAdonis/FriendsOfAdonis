import {
  type BuildSchemaOptions,
  type ResolverData as BaseResolverData,
  type NextFn,
} from 'type-graphql'
import type GraphQlServer from './server.js'
import { type HttpContext } from '@adonisjs/core/http'
import { type GraphQLSchema } from 'graphql'
import { type ConfigProvider, type LoggersList } from '@adonisjs/core/types'
import { type Repeater } from '@graphql-yoga/subscription'
import { type Logger } from '@adonisjs/core/logger'

export interface GraphQLConfig<
  KnownDriver extends GraphQLDriverContract,
  KnownPubSubDriver extends PubSubDriverContract,
  KnownSubscriptionDriver extends SubscriptionDriverContract,
> extends Omit<BuildSchemaOptions, 'resolvers' | 'container' | 'pubSub'> {
  /**
   * Path to the GraphQL endpoint.
   *
   * @example '/graphql'
   */
  path: string

  /**
   * Logger name used by the GraphQL server.
   *
   * @see {@link https://docs.adonisjs.com/guides/digging-deeper/logger#using-multiple-loggers}
   * @example 'app'
   */
  logger?: keyof LoggersList

  /**
   * GraphQL driver used for serving schema.
   *
   * @example
   *
   * drivers.apollo({
   *  playground: true,
   *  introspection: true,
   * })
   */
  driver: ConfigProvider<(logger: Logger) => KnownDriver>

  /**
   * PubSub driver for subscriptions.
   * Subscriptions are disabled if undefined.
   *
   * @example
   *
   * drivers.pubSub.native()
   */
  pubSub?: ConfigProvider<() => KnownPubSubDriver>

  /**
   * Subscription driver for handling subscriptions.
   * Should be configured in addition to a PubSub driver.
   *
   * @example
   *
   * drivers.subscription.websocket()
   */
  subscription?: ConfigProvider<() => KnownSubscriptionDriver>
}

export interface GraphQLOptions<
  KnownDriver extends GraphQLDriverContract = GraphQLDriverContract,
  KnownPubSubContract extends PubSubDriverContract = PubSubDriverContract,
  KnownSubscriptionDriver extends SubscriptionDriverContract = SubscriptionDriverContract,
> extends Omit<
  GraphQLConfig<KnownDriver, KnownPubSubContract, KnownSubscriptionDriver>,
  'driver' | 'pubSub' | 'subscription'
> {
  driver: KnownDriver
  pubSub?: KnownPubSubContract
  subscription?: KnownSubscriptionDriver
}

export type MapToNull<T> = T extends undefined ? null : T

export type LazyImport<DefaultExport> = () => Promise<{
  default: DefaultExport
}>

export type ResolverData = BaseResolverData<HttpContext>

export interface GraphQLMiddleware {
  use(action: ResolverData, next: NextFn): Promise<any>
}

export interface GraphQLDriverContract {
  start(schema: GraphQLSchema): Promise<void>
  reload(schema: GraphQLSchema): Promise<void>
  handle(ctx: HttpContext): Promise<void>
  stop(): Promise<void>
  get isReady(): boolean
}

export interface SubscriptionDriverContract {
  start(schema: GraphQLSchema): Promise<void>
  reload(schema: GraphQLSchema): Promise<void>
  stop(): Promise<void>
}

export interface PubSubDriverContract<Events = {}> {
  publish<TKey extends Extract<keyof Events, string>>(
    routingKey: TKey,
    ...args: Events[TKey] extends PubSubPublishArgsValue ? Events[TKey] : never
  ): void

  subscribe<TKey extends Extract<keyof Events, string>>(
    ...[routingKey, id]: Events[TKey] extends PubSubPublishArgsValue
      ? Events[TKey][1] extends undefined
        ? [TKey]
        : [TKey, Events[TKey][0]]
      : never
  ): Repeater<
    Events[TKey] extends PubSubPublishArgsValue
      ? Events[TKey][1] extends undefined
        ? MapToNull<Events[TKey][0]>
        : MapToNull<Events[TKey][1]>
      : never
  >

  stop(): Promise<void>
  start(): Promise<void>
}

export type ModuleImporter = (specifier: string) => Promise<unknown>

export type GraphQLDriverFactory = () => GraphQLDriverContract

export type PubSubPublishArgsValue = [] | [any] | [number | string, any]
export type PubSubPublishArgsByKey = {
  [key: string]: [] | [any] | [number | string, any]
}

export interface PubSubEvents {}

export type ResolverConfig = LazyImport<Function> | { file: string; import: LazyImport<Function> }

export interface GraphQLDriver {}
export type InferGraphQLDriver<T extends ConfigProvider<GraphQLOptions>> = Awaited<
  ReturnType<T['resolver']>
>['driver']

export interface PubSubDriver {}
export type InferPubSubDriver<T extends ConfigProvider<GraphQLOptions>> = NonNullable<
  Awaited<ReturnType<T['resolver']>>['pubSub']
>

export interface SubscriptionDriver {}
export type InferSubscriptionDriver<T extends ConfigProvider<GraphQLOptions>> = NonNullable<
  Awaited<ReturnType<T['resolver']>>['subscription']
>

export interface GraphQlService extends GraphQlServer<
  PubSubEvents,
  GraphQLDriver extends GraphQLDriverContract ? GraphQLDriver : GraphQLDriverContract,
  PubSubDriver extends PubSubDriverContract ? PubSubDriver : PubSubDriverContract,
  SubscriptionDriver extends SubscriptionDriverContract
    ? SubscriptionDriver
    : SubscriptionDriverContract
> {}
