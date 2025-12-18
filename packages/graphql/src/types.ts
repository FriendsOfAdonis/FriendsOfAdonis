import { BuildSchemaOptions, ResolverData as BaseResolverData, NextFn } from 'type-graphql'
import GraphQlServer from './server.js'
import { HttpContext } from '@adonisjs/core/http'
import { GraphQLSchema } from 'graphql'
import { LoggersList } from '@adonisjs/core/types'
import { Repeater } from '@graphql-yoga/subscription'
import { ServerOptions } from 'graphql-ws'

export type GraphQLConfig = Omit<BuildSchemaOptions, 'resolvers' | 'container' | 'pubSub'> & {
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
   * Options for graphql-ws `useServer`.
   * Only relevant when using subscriptions over Websocket.
   *
   * @see {@link https://the-guild.dev/graphql/ws/docs/use/ws/functions/useServer}
   */
  ws?: ServerOptions
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

export interface PubSubContract<Events> {
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

export type GraphQLDriverFactory = () => GraphQLDriverContract

export type PubSubPublishArgsValue = [] | [any] | [number | string, any]
export type PubSubPublishArgsByKey = {
  [key: string]: [] | [any] | [number | string, any]
}

export interface PubSubEvents {}
