import { RedisClusterConnection } from '@adonisjs/redis'
import { FlickDriverContract } from '../types.ts'
import { RedisConnections } from '@adonisjs/redis/types'

export interface FlickRedisDriverConfig {
  connection: keyof RedisConnections
  prefix?: string
}

export interface FlickRedisDriverOptions {
  connection: RedisClusterConnection
  prefix: string
}

export class FlickRedisDriver implements FlickDriverContract {
  private prefix: string
  private connection: RedisClusterConnection

  constructor(options: FlickRedisDriverOptions) {
    this.prefix = options.prefix
    this.connection = options.connection
  }

  private get storeKey() {
    return `${this.prefix}:store`
  }

  private field(feature: string, identifier: string | number) {
    return `${feature}:${identifier}`
  }

  async set(feature: string, identifier: string | number, value: unknown) {
    this.connection.hset(this.storeKey, this.field(feature, identifier), JSON.stringify(value))
  }

  async get(feature: string, identifier: string | number) {
    const raw = await this.connection.hget(this.storeKey, this.field(feature, identifier))
    return raw === null ? undefined : JSON.parse(raw)
  }

  async delete(feature: string, identifier: string | number): Promise<void> {
    await this.connection.hdel(this.storeKey, this.field(feature, identifier))
  }

  async purge(features?: string[]): Promise<void> {
    if (!features) return this.flush()
    if (!features.length) return

    for (const feature of features) {
      const stream = this.connection.hscanStream(this.storeKey, {
        match: `${feature}:*`,
        count: 100,
      })

      for await (const chunk of stream) {
        const fields = (chunk as string[]).filter((_, i) => i % 2 === 0)
        if (fields.length) await this.connection.hdel(this.storeKey, ...fields)
      }
    }
  }

  async flush() {
    await this.connection.del(this.storeKey)
  }
}
