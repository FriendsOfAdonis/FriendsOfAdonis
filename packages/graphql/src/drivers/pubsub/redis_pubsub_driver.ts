import { type PubSubEvents } from '../../types.js'
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target'
import { Redis, type RedisOptions } from 'ioredis'
import { NativePubSub } from './native_pubsub_driver.js'

export type RedisPubSubConfig = {
  publish?: RedisOptions
  subscribe?: RedisOptions
}

export class RedisPubSub<Events = PubSubEvents> extends NativePubSub<Events> {
  publishClient: Redis
  subscribeClient: Redis

  constructor(config: RedisPubSubConfig = {}) {
    const publishClient = new Redis({
      lazyConnect: true,
      ...config.publish,
    })
    const subscribeClient = new Redis({
      lazyConnect: true,
      ...config.subscribe,
    })

    const eventTarget = createRedisEventTarget({
      publishClient: publishClient,
      subscribeClient: subscribeClient,
    })

    super({
      eventTarget,
    })

    this.publishClient = publishClient
    this.subscribeClient = subscribeClient
  }

  /**
   * Connects both clients eagerly. Without it, each client connects
   * on its first publish or subscribe.
   */
  async start(): Promise<void> {
    await Promise.all([this.publishClient.connect(), this.subscribeClient.connect()])
  }

  /**
   * Closes the clients that connected, whether through `start` or
   * lazily on their first use. Safe to call more than once.
   */
  async stop(): Promise<void> {
    await Promise.all([
      this.#stopClient(this.publishClient),
      this.#stopClient(this.subscribeClient),
    ])
  }

  async #stopClient(client: Redis) {
    if (client.status === 'wait' || client.status === 'end') return
    await client.quit()
  }
}
