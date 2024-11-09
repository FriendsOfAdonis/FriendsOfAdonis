import { BuildSchemaOptions } from 'type-graphql'
import GraphQlServer from './server.js'
import { ApolloServerOptionsWithSchema, BaseContext } from '@apollo/server'

export type GraphQlConfig = {
  apollo: Omit<ApolloServerOptionsWithSchema<BaseContext>, 'schema'> & {
    playground: boolean
  }
} & Omit<BuildSchemaOptions, 'resolvers' | 'container'>

export interface GraphQlService extends GraphQlServer {}

export type LazyImport<DefaultExport> = () => Promise<{
  default: DefaultExport
}>
