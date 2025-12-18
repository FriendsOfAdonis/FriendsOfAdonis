import { BouncerAbility } from '@adonisjs/bouncer/types'

export { configure } from './configure.js'
export { defineConfig, drivers, pubsubs } from './src/define_config.js'
export * as errors from './src/errors/main.js'
export { CurrentUser } from './src/decorators/user.js'

export type {
  ResolverData,
  GraphQLMiddleware,
  GraphQLConfig as GraphQlConfig,
} from './src/types.js'

type MethodPropClassDecorator = PropertyDecorator & MethodDecorator & ClassDecorator

// Overwrite Authorized decorator declaration
export declare function Authorized(): MethodPropClassDecorator
export declare function Authorized(roles: readonly BouncerAbility<any>[]): MethodPropClassDecorator
export declare function Authorized(
  ...roles: readonly BouncerAbility<any>[]
): MethodPropClassDecorator

export * from 'type-graphql'
