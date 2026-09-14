import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { configProvider } from '@adonisjs/core'
import { type GraphQLSchema } from 'graphql'
import { RedisPubSub } from '../src/drivers/pubsub/redis_pubsub_driver.js'
import { NativePubSub } from '../src/drivers/pubsub/native_pubsub_driver.js'
import { defineConfig } from '../src/define_config.js'
import { type GraphQLDriverContract, type SubscriptionDriverContract } from '../src/types.js'
import { TestResolver } from './fixtures/test_resolver.js'
import { BASE_URL } from './helpers.js'

/**
 * Driver recording how many times it was stopped.
 */
class FakeDriver implements GraphQLDriverContract {
  starts = 0
  stops = 0
  #isReady = false

  get isReady() {
    return this.#isReady
  }

  async start() {
    this.starts++
    this.#isReady = true
  }

  async reload(_schema: GraphQLSchema) {}

  async handle() {}

  async stop() {
    this.stops++
    this.#isReady = false
  }
}

class FakeSubscriptionDriver implements SubscriptionDriverContract {
  stops = 0
  async start(_schema: GraphQLSchema) {}
  async reload(_schema: GraphQLSchema) {}
  async stop() {
    this.stops++
  }
}

class FakePubSub extends NativePubSub {
  stops = 0
  async stop() {
    this.stops++
  }
}

/**
 * Boots an application the way an ace command or a queue worker
 * runs: the provider registers the server but never starts it.
 */
async function setupConsoleApp() {
  const driver = new FakeDriver()
  const subscription = new FakeSubscriptionDriver()
  const pubSub = new FakePubSub()
  let pubSubResolved = false

  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [{ file: () => import('../providers/graphql_provider.js') }],
      },
      config: {
        graphql: defineConfig({
          path: '/graphql',
          driver: configProvider.create(async () => () => driver),
          subscription: configProvider.create(async () => () => subscription),
          pubSub: configProvider.create(async () => {
            pubSubResolved = true
            return () => pubSub
          }),
        }),
      },
    })
    .create(BASE_URL, {
      importer: (filePath) => import(filePath),
    })

  const app = ignitor.createApp('console')
  await app.init()
  await app.boot()

  return { app, driver, subscription, pubSub, wasPubSubResolved: () => pubSubResolved }
}

test.group('RedisPubSub | stop', () => {
  /**
   * Replaces `quit` on both clients so the test never needs a Redis
   * server, and returns the clients it was called on.
   */
  function trackQuits(pubSub: RedisPubSub) {
    const quits: string[] = []
    for (const [name, client] of Object.entries({
      publish: pubSub.publishClient,
      subscribe: pubSub.subscribeClient,
    })) {
      client.quit = async () => {
        quits.push(name)
        return 'OK'
      }
    }
    return quits
  }

  test('leaves clients that never connected alone', async ({ expect }) => {
    const pubSub = new RedisPubSub()
    const quits = trackQuits(pubSub)

    await pubSub.stop()

    expect(quits).toEqual([])
    expect(pubSub.publishClient.status).toBe('wait')
    expect(pubSub.subscribeClient.status).toBe('wait')
  })

  test('quits the clients that connected', async ({ expect }) => {
    const pubSub = new RedisPubSub()
    const quits = trackQuits(pubSub)
    pubSub.publishClient.status = 'ready'
    pubSub.subscribeClient.status = 'connecting'

    await pubSub.stop()

    expect(quits.sort()).toEqual(['publish', 'subscribe'])
  })

  test('skips clients that already ended', async ({ expect }) => {
    const pubSub = new RedisPubSub()
    const quits = trackQuits(pubSub)
    pubSub.publishClient.status = 'ready'
    pubSub.subscribeClient.status = 'end'

    await pubSub.stop()

    expect(quits).toEqual(['publish'])
  })
})

test.group('GraphQLProvider | shutdown', () => {
  test('closes the PubSub used by a console process', async ({ expect }) => {
    const { app, driver, subscription, pubSub } = await setupConsoleApp()
    await app.container.make('graphql')

    await app.terminate()

    expect(pubSub.stops).toBe(1)
    expect(driver.stops).toBe(0)
    expect(subscription.stops).toBe(0)
  })

  test('does not resolve the server when nothing used it', async ({ expect }) => {
    const { app, pubSub, wasPubSubResolved } = await setupConsoleApp()

    await app.terminate()

    expect(wasPubSubResolved()).toBe(false)
    expect(pubSub.stops).toBe(0)
  })

  test('stops a started server once, even when stopped twice', async ({ expect, cleanup }) => {
    const { app, driver, subscription, pubSub } = await setupConsoleApp()
    cleanup(() => app.terminate())

    const graphql = await app.container.make('graphql')
    graphql.resolvers([() => Promise.resolve({ default: TestResolver })])
    await graphql.start()

    await graphql.stop()
    await graphql.stop()

    expect(driver.starts).toBe(1)
    expect(driver.stops).toBe(1)
    expect(subscription.stops).toBe(1)
    expect(pubSub.stops).toBe(2)
  })
})
