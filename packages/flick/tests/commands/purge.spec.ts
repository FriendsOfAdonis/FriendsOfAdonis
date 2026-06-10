import { test } from '@japa/runner'
import { Container } from '@adonisjs/core/container'
import { createApplication } from '../helpers.js'
import PurgeCommand from '../../commands/purge.ts'
import { Flick } from '../../src/flick.ts'
import { FlickMemoryDriver } from '../../src/drivers/memory_driver.ts'
import { BaseFeature } from '../../src/base_feature.ts'

class DummyFeature extends BaseFeature {
  async resolve() {
    return true
  }
}

async function setup() {
  const { ace, app } = await createApplication()

  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const features = {
    feature_a: async () => ({ default: DummyFeature }),
    feature_b: async () => ({ default: DummyFeature }),
    feature_c: async () => ({ default: DummyFeature }),
  }
  const flick = new Flick(features as any, resolver as any, driver)
  app.container.singleton('flick', () => flick as any)

  await driver.set('feature_a', 'user-1', true)
  await driver.set('feature_b', 'user-1', true)
  await driver.set('feature_c', 'user-1', true)

  return { ace, driver }
}

test.group('PurgeCommand', () => {
  test('should purge every feature when no arguments are given', async ({ assert }) => {
    const { ace, driver } = await setup()

    const command = await ace.create(PurgeCommand, [])
    await command.exec()

    command.assertSucceeded()
    assert.isUndefined(await driver.get('feature_a', 'user-1'))
    assert.isUndefined(await driver.get('feature_b', 'user-1'))
    assert.isUndefined(await driver.get('feature_c', 'user-1'))
  })

  test('should purge only the given features', async ({ assert }) => {
    const { ace, driver } = await setup()

    const command = await ace.create(PurgeCommand, ['feature_a', 'feature_b'])
    await command.exec()

    command.assertSucceeded()
    assert.isUndefined(await driver.get('feature_a', 'user-1'))
    assert.isUndefined(await driver.get('feature_b', 'user-1'))
    assert.strictEqual(await driver.get('feature_c', 'user-1'), true)
  })

  test('should purge every feature except the given ones', async ({ assert }) => {
    const { ace, driver } = await setup()

    const command = await ace.create(PurgeCommand, ['--except=feature_a'])
    await command.exec()

    command.assertSucceeded()
    assert.strictEqual(await driver.get('feature_a', 'user-1'), true)
    assert.isUndefined(await driver.get('feature_b', 'user-1'))
    assert.isUndefined(await driver.get('feature_c', 'user-1'))
  })

  test('should fail and purge nothing when a feature is unknown', async ({ assert }) => {
    const { ace, driver } = await setup()

    const command = await ace.create(PurgeCommand, ['nope'])
    await command.exec()

    command.assertFailed()
    assert.strictEqual(await driver.get('feature_a', 'user-1'), true)
    assert.strictEqual(await driver.get('feature_b', 'user-1'), true)
    assert.strictEqual(await driver.get('feature_c', 'user-1'), true)
  })

  test('should fail when combining feature arguments with --except', async ({ assert }) => {
    const { ace, driver } = await setup()

    const command = await ace.create(PurgeCommand, ['feature_a', '--except=feature_b'])
    await command.exec()

    command.assertFailed()
    assert.strictEqual(await driver.get('feature_a', 'user-1'), true)
    assert.strictEqual(await driver.get('feature_b', 'user-1'), true)
  })
})
