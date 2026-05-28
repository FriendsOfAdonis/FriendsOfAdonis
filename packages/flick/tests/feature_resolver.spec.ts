import { test } from '@japa/runner'
import { Container } from '@adonisjs/core/container'
import { Flick } from '../src/flick.ts'
import { BaseFeature } from '../src/base_feature.ts'
import { FlickMemoryDriver } from '../src/drivers/memory_driver.ts'
import { FeatureScopeable } from '../src/types.ts'

const scope: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

class OnFeature extends BaseFeature {
  async resolve() {
    return true
  }
}

class OffFeature extends BaseFeature {
  async resolve() {
    return false
  }
}

class NumberFeature extends BaseFeature {
  async resolve() {
    return 5
  }
}

class ZeroFeature extends BaseFeature {
  async resolve() {
    return 0
  }
}

function createResolver() {
  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const flick = new Flick(
    {
      on: async () => ({ default: OnFeature }),
      off: async () => ({ default: OffFeature }),
      num: async () => ({ default: NumberFeature }),
      zero: async () => ({ default: ZeroFeature }),
    } as any,
    resolver as any,
    driver
  )

  return flick.for(scope)
}

test.group('FeatureResolver', () => {
  test('isActive should reflect truthiness of the resolved value', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.isActive('on'))
    assert.isTrue(await flick.isActive('num'))
    assert.isFalse(await flick.isActive('off'))
    assert.isFalse(await flick.isActive('zero'))
  })

  test('isInactive should reflect falsiness of the resolved value', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.isInactive('off'))
    assert.isTrue(await flick.isInactive('zero'))
    assert.isFalse(await flick.isInactive('on'))
    assert.isFalse(await flick.isInactive('num'))
  })

  test('allActive should be true only when every feature is active', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.allActive(['on', 'num']))
    assert.isFalse(await flick.allActive(['on', 'off']))
  })

  test('someActive should be true when at least one feature is active', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.someActive(['off', 'on']))
    assert.isFalse(await flick.someActive(['off', 'zero']))
  })

  test('allInactive should be true only when every feature is inactive', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.allInactive(['off', 'zero']))
    assert.isFalse(await flick.allInactive(['off', 'on']))
  })

  test('someInactive should be true when at least one feature is inactive', async ({ assert }) => {
    const flick = createResolver()

    assert.isTrue(await flick.someInactive(['on', 'off']))
    assert.isFalse(await flick.someInactive(['on', 'num']))
  })

  test('match should invoke the active branch for active features', async ({ assert }) => {
    const flick = createResolver()
    let inactiveCalled = false

    const result = await flick.match('on', {
      active: () => 'active',
      inactive: () => {
        inactiveCalled = true
        return 'inactive'
      },
    })

    assert.equal(result, 'active')
    assert.isFalse(inactiveCalled)
  })

  test('match should invoke the inactive branch for inactive features', async ({ assert }) => {
    const flick = createResolver()
    let activeCalled = false

    const result = await flick.match('off', {
      active: () => {
        activeCalled = true
        return 'active'
      },
      inactive: () => 'inactive',
    })

    assert.equal(result, 'inactive')
    assert.isFalse(activeCalled)
  })

  test('value should return the resolved value', async ({ assert }) => {
    const flick = createResolver()

    assert.strictEqual(await flick.value('num'), 5)
    assert.strictEqual(await flick.value('off'), false)
  })

  test('values should return resolved values in order', async ({ assert }) => {
    const flick = createResolver()

    assert.deepEqual(await flick.values(['on', 'num', 'zero']), [true, 5, 0])
  })
})
