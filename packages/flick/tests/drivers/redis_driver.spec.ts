import { test } from '@japa/runner'
import { RedisContainer, type StartedRedisContainer } from '@testcontainers/redis'
import { RedisManagerFactory } from '@adonisjs/redis/factories'
import { RedisManager, RedisClusterConnection } from '@adonisjs/redis'
import type { RedisConnectionConfig } from '@adonisjs/redis/types'
import { FlickRedisDriver } from '../../src/drivers/redis_driver.ts'

const PREFIX = 'flick-test'

test.group('Redis driver', (group) => {
  let container: StartedRedisContainer
  let manager: RedisManager<{ main: RedisConnectionConfig }>
  let driver: FlickRedisDriver

  group.tap((t) => t.timeout(60_000))

  group.setup(async () => {
    container = await new RedisContainer('redis:7-alpine').start()

    const connections: { main: RedisConnectionConfig } = {
      main: { host: container.getHost(), port: container.getPort() },
    }

    manager = new RedisManagerFactory({ connection: 'main', connections }).create()

    const connection = manager.connection('main') as unknown as RedisClusterConnection
    driver = new FlickRedisDriver({ connection, prefix: PREFIX })

    return async () => {
      await manager.quitAll()
      await container.stop()
    }
  })

  group.each.teardown(async () => {
    await manager.connection('main').flushdb()
  })

  test('should store and retrieve a value', async ({ assert }) => {
    await driver.set('feature', 'user-1', true)

    assert.strictEqual(await driver.get('feature', 'user-1'), true)
  })

  test('should return undefined for an unknown feature', async ({ assert }) => {
    assert.isUndefined(await driver.get('feature', 'user-1'))
  })

  test('should return undefined for an unknown identifier', async ({ assert }) => {
    await driver.set('feature', 'user-1', true)

    assert.isUndefined(await driver.get('feature', 'user-2'))
  })

  test('should overwrite an existing value', async ({ assert }) => {
    await driver.set('feature', 'user-1', true)
    await driver.set('feature', 'user-1', false)

    assert.strictEqual(await driver.get('feature', 'user-1'), false)
  })

  test('should preserve falsy values', async ({ assert }) => {
    await driver.set('feature', 'false', false)
    await driver.set('feature', 'zero', 0)
    await driver.set('feature', 'empty', '')
    await driver.set('feature', 'null', null)

    assert.strictEqual(await driver.get('feature', 'false'), false)
    assert.strictEqual(await driver.get('feature', 'zero'), 0)
    assert.strictEqual(await driver.get('feature', 'empty'), '')
    assert.strictEqual(await driver.get('feature', 'null'), null)
  })

  test('should round-trip complex values', async ({ assert }) => {
    const value = { enabled: true, variants: ['a', 'b'], ratio: 0.25 }
    await driver.set('feature', 'user-1', value)

    assert.deepEqual(await driver.get('feature', 'user-1'), value)
  })

  test('should support numeric identifiers', async ({ assert }) => {
    await driver.set('feature', 1, 'value')

    assert.strictEqual(await driver.get('feature', 1), 'value')
  })

  test('should isolate values across features', async ({ assert }) => {
    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')

    assert.strictEqual(await driver.get('feature-a', 'user-1'), 'a')
    assert.strictEqual(await driver.get('feature-b', 'user-1'), 'b')
  })

  test('should isolate values across prefixes', async ({ assert }) => {
    const connection = manager.connection('main') as unknown as RedisClusterConnection
    const other = new FlickRedisDriver({ connection, prefix: 'other' })

    await driver.set('feature', 'user-1', true)

    assert.isUndefined(await other.get('feature', 'user-1'))
  })

  test('should delete a value', async ({ assert }) => {
    await driver.set('feature', 'user-1', true)
    await driver.delete('feature', 'user-1')

    assert.isUndefined(await driver.get('feature', 'user-1'))
  })

  test('should only delete the targeted identifier', async ({ assert }) => {
    await driver.set('feature', 'user-1', true)
    await driver.set('feature', 'user-2', true)
    await driver.delete('feature', 'user-1')

    assert.isUndefined(await driver.get('feature', 'user-1'))
    assert.strictEqual(await driver.get('feature', 'user-2'), true)
  })

  test('should not throw when deleting an unknown value', async () => {
    await driver.delete('feature', 'user-1')
  })

  test('should purge only the given features', async ({ assert }) => {
    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-a', 'user-2', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.purge(['feature-a'])

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.isUndefined(await driver.get('feature-a', 'user-2'))
    assert.strictEqual(await driver.get('feature-b', 'user-1'), 'b')
  })

  test('should purge everything when no features are given', async ({ assert }) => {
    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.purge()

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.isUndefined(await driver.get('feature-b', 'user-1'))
  })

  test('should keep all values when purging an empty list', async ({ assert }) => {
    await driver.set('feature-a', 'user-1', 'a')
    await driver.purge([])

    assert.strictEqual(await driver.get('feature-a', 'user-1'), 'a')
  })

  test('should flush all values', async ({ assert }) => {
    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.flush()

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.isUndefined(await driver.get('feature-b', 'user-1'))
  })
})
