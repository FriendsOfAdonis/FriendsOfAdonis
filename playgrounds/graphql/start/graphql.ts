import graphql from '@foadonis/graphql/services/main'

graphql.resolvers([
  () => import('#graphql/resolvers/recipe_resolver'),
  () => import('#graphql/resolvers/user_resolver'),
  () => import('#graphql/resolvers/auth_resolver'),
  () => import('#graphql/resolvers/subscription_resolver'),
])
