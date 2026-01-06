import { type PubSubEvents } from '../types.js'
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target'
import { Redis, type RedisOptions } from 'ioredis'
import { NativePubSub } from './native_pubsub.js'

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

  async start(): Promise<void> {
    await Promise.all([this.publishClient.connect(), this.subscribeClient.connect()])
  }

  async stop(): Promise<void> {
    await Promise.all([this.publishClient.disconnect(), this.subscribeClient.disconnect()])
  }
}
