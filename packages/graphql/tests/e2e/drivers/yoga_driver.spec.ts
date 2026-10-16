import { test } from '@japa/runner'
import { setupApp } from '../../helpers.js'
import { defineConfig, drivers } from '../../../src/define_config.js'
import { defineConfig as defineBodyParserConfig } from '@adonisjs/core/bodyparser'
import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { OperationTypeNode } from 'graphql'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { TestResolver } from '../../fixtures/test_resolver.js'
import { UploadResolver } from '../../fixtures/upload_resolver.js'
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

async function setupYogaApp(bodyparser?: ReturnType<typeof defineBodyParserConfig>) {
  return setupApp(
    (factory) =>
      factory.merge({
        config: {
          graphql: defineConfig({
            path: '/graphql',
            driver: drivers.yoga({}),
            pubSub: drivers.pubsub.native(),
            subscription: drivers.subscription.websocket({ path: '/graphql' }),
          }),
          bodyparser:
            bodyparser ??
            defineBodyParserConfig({
              multipart: {
                autoProcess: true,
                processManually: ['/graphql'],
              },
            }),
        },
      }),
    (app) => {
      app.booted(async () => {
        const graphql = await app.container.make('graphql')
        const router = await app.container.make('router')
        graphql.resolvers([
          () => Promise.resolve({ default: TestResolver }),
          () => Promise.resolve({ default: UploadResolver }),
        ])
        graphql.registerRoute(router)
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

  function buildUploadForm() {
    const form = new FormData()
    form.append(
      'operations',
      JSON.stringify({
        query: 'mutation TestUpload($file: File!) { testUpload(file: $file) }',
        variables: { file: null },
      })
    )
    form.append('map', JSON.stringify({ '0': ['variables.file'] }))
    form.append('0', new File(['Hello Yoga'], 'hello.txt', { type: 'text/plain' }))
    return form
  }

  test('should support file uploads', async ({ expect, cleanup }) => {
    const { app } = await setupYogaApp()
    cleanup(async () => {
      await app.terminate()
    })

    const response = await fetch('http://localhost:3333/graphql', {
      method: 'POST',
      body: buildUploadForm(),
    })

    const result = (await response.json()) as any

    expect(response.status).toBe(200)
    expect(result).toMatchObject({ data: { testUpload: 'hello.txt:Hello Yoga' } })
  })

  test('should fail with an actionable error when the bodyparser consumed the multipart body', async ({
    expect,
    cleanup,
  }) => {
    const { app } = await setupYogaApp(
      defineBodyParserConfig({
        multipart: {
          autoProcess: true,
        },
      })
    )
    cleanup(async () => {
      await app.terminate()
    })

    const response = await fetch('http://localhost:3333/graphql', {
      method: 'POST',
      body: buildUploadForm(),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toContain('processManually')
  })

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
