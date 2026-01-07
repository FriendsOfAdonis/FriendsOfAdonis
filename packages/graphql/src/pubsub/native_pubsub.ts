import { createPubSub, type PubSub, type Repeater } from '@graphql-yoga/subscription'
import {
  type MapToNull,
  type PubSubDriverContract,
  type PubSubEvents,
  type PubSubPublishArgsByKey,
  type PubSubPublishArgsValue,
} from '../types.js'
import { type ChannelPubSubConfig } from '@graphql-yoga/subscription/create-pub-sub'

export type NativePubSubConfig = ChannelPubSubConfig<PubSubPublishArgsByKey>

export class NativePubSub<Events = PubSubEvents> implements PubSubDriverContract<Events> {
  native: PubSub<PubSubPublishArgsByKey>

  constructor(options?: NativePubSubConfig) {
    this.native = createPubSub(options)
  }

  publish<TKey extends Extract<keyof Events, string>>(
    routingKey: TKey,
    ...args: Events[TKey] extends PubSubPublishArgsValue ? Events[TKey] : never
  ): void {
    return this.native.publish(routingKey, ...args)
  }

  subscribe<TKey extends Extract<keyof Events, string>>(
    ...[routingKey, id]: Events[TKey] extends PubSubPublishArgsValue
      ? Events[TKey][1] extends undefined
        ? [TKey]
        : [TKey, Events[TKey][0]]
      : never
  ): Repeater<
    Events[TKey] extends PubSubPublishArgsValue
      ? Events[TKey][1] extends undefined
        ? MapToNull<Events[TKey][0]>
        : MapToNull<Events[TKey][1]>
      : never,
    any,
    unknown
  > {
    return this.native.subscribe(routingKey, id)
  }

  async start(): Promise<void> {}
  async stop(): Promise<void> {}
}
