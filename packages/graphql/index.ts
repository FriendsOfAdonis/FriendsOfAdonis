export { configure } from './configure.js'
export { defineConfig, drivers } from './src/define_config.js'
export * as errors from './src/errors/main.js'
export { CurrentUser } from './src/decorators/user.js'
export { Authorized } from './src/decorators/authorized.js'
export { indexResolvers } from './src/hooks/index_resolvers.js'

export type {
  ResolverData,
  GraphQLMiddleware,
  GraphQLConfig as GraphQlConfig,
  AuthorizationRule,
  PolicyAuthorizationRule,
} from './src/types.js'

export * from 'type-graphql'
