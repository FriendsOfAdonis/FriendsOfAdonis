import { test } from '@japa/runner'
import { FlickMemoryDriver } from '../../src/drivers/memory_driver.ts'

test.group('Memory driver', () => {
  test('should store and retrieve a value', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'user-1', true)

    assert.strictEqual(await driver.get('feature', 'user-1'), true)
  })

  test('should return undefined for an unknown feature', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    assert.isUndefined(await driver.get('feature', 'user-1'))
  })

  test('should return undefined for an unknown identifier', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'user-1', true)

    assert.isUndefined(await driver.get('feature', 'user-2'))
  })

  test('should overwrite an existing value', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'user-1', true)
    await driver.set('feature', 'user-1', false)

    assert.strictEqual(await driver.get('feature', 'user-1'), false)
  })

  test('should preserve falsy values', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'false', false)
    await driver.set('feature', 'zero', 0)
    await driver.set('feature', 'empty', '')
    await driver.set('feature', 'null', null)

    assert.strictEqual(await driver.get('feature', 'false'), false)
    assert.strictEqual(await driver.get('feature', 'zero'), 0)
    assert.strictEqual(await driver.get('feature', 'empty'), '')
    assert.strictEqual(await driver.get('feature', 'null'), null)
  })

  test('should keep string and number identifiers distinct', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 1, 'number')
    await driver.set('feature', '1', 'string')

    assert.strictEqual(await driver.get('feature', 1), 'number')
    assert.strictEqual(await driver.get('feature', '1'), 'string')
  })

  test('should isolate values across features', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')

    assert.strictEqual(await driver.get('feature-a', 'user-1'), 'a')
    assert.strictEqual(await driver.get('feature-b', 'user-1'), 'b')
  })

  test('should delete a value', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'user-1', true)
    await driver.delete('feature', 'user-1')

    assert.isUndefined(await driver.get('feature', 'user-1'))
  })

  test('should only delete the targeted identifier', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature', 'user-1', true)
    await driver.set('feature', 'user-2', true)
    await driver.delete('feature', 'user-1')

    assert.isUndefined(await driver.get('feature', 'user-1'))
    assert.strictEqual(await driver.get('feature', 'user-2'), true)
  })

  test('should not throw when deleting from an unknown feature', async () => {
    const driver = new FlickMemoryDriver()

    await driver.delete('feature', 'user-1')
  })

  test('should purge only the given features', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.purge(['feature-a'])

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.strictEqual(await driver.get('feature-b', 'user-1'), 'b')
  })

  test('should purge everything when no features are given', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.purge()

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.isUndefined(await driver.get('feature-b', 'user-1'))
  })

  test('should keep all values when purging an empty list', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature-a', 'user-1', 'a')
    await driver.purge([])

    assert.strictEqual(await driver.get('feature-a', 'user-1'), 'a')
  })

  test('should flush all values', async ({ assert }) => {
    const driver = new FlickMemoryDriver()

    await driver.set('feature-a', 'user-1', 'a')
    await driver.set('feature-b', 'user-1', 'b')
    await driver.flush()

    assert.isUndefined(await driver.get('feature-a', 'user-1'))
    assert.isUndefined(await driver.get('feature-b', 'user-1'))
  })
})
