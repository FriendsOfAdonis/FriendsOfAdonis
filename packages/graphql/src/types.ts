import { BuildSchemaOptions, ResolverData as BaseResolverData, NextFn } from 'type-graphql'
import GraphQlServer from './server.js'
import { HttpContext } from '@adonisjs/core/http'
import { GraphQLSchema } from 'graphql'
import { LoggersList } from '@adonisjs/core/types'

export type GraphQLConfig = {} & Omit<BuildSchemaOptions, 'resolvers' | 'container'> & {
    path: string
    logger?: keyof LoggersList
  }

export interface GraphQlService extends GraphQlServer {}

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

export type GraphQLDriverFactory = () => GraphQLDriverContract
