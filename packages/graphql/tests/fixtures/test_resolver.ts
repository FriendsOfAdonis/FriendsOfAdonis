import { Arg, Mutation, Query, Resolver, Root, Subscription } from '../../index.js'
import { inject } from '@adonisjs/core'
import GraphQLServer from '../../src/server.js'

@Resolver()
@inject()
export class TestResolver {
  constructor(private graphql: GraphQLServer) {}

  @Query(() => String)
  testQuery(@Arg('name', () => String) name: string) {
    return `Hello ${name}`
  }

  @Mutation(() => Boolean)
  testMutation() {
    return true
  }

  @Mutation(() => Boolean)
  async testSubscriptionMutation(@Arg('value', () => String) value: string) {
    this.graphql.pubSub.publish('NOTIFICATIONS', value)
    return true
  }

  @Subscription(() => String, {
    topics: 'NOTIFICATIONS',
  })
  testSubscription(@Root() payload: any) {
    return payload
  }
}
