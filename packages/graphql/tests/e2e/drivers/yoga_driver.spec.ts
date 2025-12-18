import { test } from '@japa/runner'
import { setupApp } from '../../helpers.js'
import { defineConfig, drivers, pubsubs } from '../../../src/define_config.js'
import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { OperationTypeNode } from 'graphql'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { TestResolver } from '../../fixtures/test_resolver.js'
import WebSocket from 'ws'

export function setupApolloClient() {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:3333/graphql',
      webSocketImpl: WebSocket,
    })
  )

  const httpLink = new HttpLink({
    uri: 'http://localhost:3333/graphql',
  })

  const splitLink = ApolloLink.split(
    ({ operationType }) => {
      return operationType === OperationTypeNode.SUBSCRIPTION
    },
    wsLink,
    httpLink
  )

  const apollo = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  })

  return { apollo, wsLink, httpLink }
}

async function setupYogaApp() {
  return setupApp(
    (factory) =>
      factory.merge({
        config: {
          graphql: defineConfig({
            path: '/graphql',
            driver: drivers.yoga({}),
            pubSub: pubsubs.native(),
          }),
        },
      }),
    (app) => {
      app.booted(async () => {
        const graphql = await app.container.make('graphql')
        graphql.resolvers.set('test_resolver', TestResolver)
      })
    }
  )
}

test.group('YogaDriver', () => {
  test('should support queries', async ({ expect, cleanup }) => {
    const { apollo } = setupApolloClient()
    const { app } = await setupYogaApp()
    cleanup(async () => {
      await app.terminate()
      apollo.stop()
    })

    const { data } = await apollo.query<any>({
      query: gql`
        query TestQuery($name: String!) {
          testQuery(name: $name)
        }
      `,
      variables: {
        name: 'AdonisJS',
      },
    })

    expect(data).toMatchObject({ testQuery: 'Hello AdonisJS' })
  }).skip(false)

  test('should support mutations', async ({ expect, cleanup }) => {
    const { apollo } = setupApolloClient()
    const { app } = await setupYogaApp()
    cleanup(async () => {
      await app.terminate()
      apollo.stop()
    })

    const { data } = await apollo.mutate<any>({
      mutation: gql`
        mutation TestMutation {
          testMutation
        }
      `,
    })

    expect(data).toMatchObject({ testMutation: true })
  }).skip(false)

  test('should support subscriptions over Websockets', async ({ expect, cleanup }) => {
    const { app } = await setupYogaApp()
    const { apollo, wsLink } = setupApolloClient()
    cleanup(async () => {
      await app.terminate()
      apollo.stop()
    })

    const MUTATION = gql`
      mutation TestSubscriptionMutation($value: String!) {
        testSubscriptionMutation(value: $value)
      }
    `

    const observable = apollo.subscribe<any>({
      query: gql`
        subscription TestSubscription {
          testSubscription
        }
      `,
    })

    let value: any

    const sub = observable.subscribe(({ data }) => {
      value = data
    })

    await new Promise((res) => wsLink.client.on('connected', res))

    await apollo.mutate<any>({
      mutation: MUTATION,
      variables: {
        value: '@foadonis/graphql',
      },
    })

    expect(value).toMatchObject({ testSubscription: '@foadonis/graphql' })

    await apollo.mutate<any>({
      mutation: MUTATION,
      variables: {
        value: '@foadonis/openapi',
      },
    })

    expect(value).toMatchObject({ testSubscription: '@foadonis/openapi' })

    sub.unsubscribe()
  })
})
