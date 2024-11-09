import { BuildSchemaOptions, ResolverData as BaseResolverData, NextFn } from 'type-graphql'
import GraphQlServer from './server.js'
import { ApolloServerOptionsWithSchema, BaseContext } from '@apollo/server'
import { HttpContext } from '@adonisjs/core/http'

export type GraphQLConfig = {
  apollo: Omit<ApolloServerOptionsWithSchema<BaseContext>, 'schema'> & {
    playground: boolean
  }
} & Omit<BuildSchemaOptions, 'resolvers' | 'container'> & {
    path: string
  }

export interface GraphQlService extends GraphQlServer {}

export type LazyImport<DefaultExport> = () => Promise<{
  default: DefaultExport
}>

export type ResolverData = BaseResolverData<HttpContext>

export interface GraphQLMiddleware {
  use(action: ResolverData, next: NextFn): Promise<any>
}
