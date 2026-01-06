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
import { type ServerOptions } from 'graphql-ws'
import { type Logger } from '@adonisjs/core/logger'

export interface GraphQLConfig<
  KnownDriver extends GraphQLDriverContract,
  KnownPubSub extends PubSubContract,
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
   * pubSub.native()
   */
  pubSub?: ConfigProvider<() => KnownPubSub>

  /**
   * Options for graphql-ws `useServer`.
   * Only relevant when using subscriptions over Websocket.
   *
   * @see {@link https://the-guild.dev/graphql/ws/docs/use/ws/functions/useServer}
   */
  ws?: ServerOptions
}

export interface GraphQLOptions<
  KnownDriver extends GraphQLDriverContract = GraphQLDriverContract,
  KnownPubSub extends PubSubContract = PubSubContract,
> extends Omit<GraphQLConfig<KnownDriver, KnownPubSub>, 'driver' | 'pubSub'> {
  driver: KnownDriver
  pubSub?: KnownPubSub
}

export interface GraphQlService extends GraphQlServer<PubSubEvents> {}
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

export interface PubSubContract<Events = {}> {
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
