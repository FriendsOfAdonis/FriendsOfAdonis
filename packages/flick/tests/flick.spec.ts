import { test } from '@japa/runner'
import { Container } from '@adonisjs/core/container'
import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Flick } from '../src/flick.ts'
import { FeatureResolver } from '../src/feature_resolver.ts'
import { BaseFeature } from '../src/base_feature.ts'
import { FlickMemoryDriver } from '../src/drivers/memory_driver.ts'
import { FeatureScopeable } from '../src/types.ts'

const scope: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

class NoopFeature extends BaseFeature {
  async resolve() {
    return 'noop'
  }
}

function createFlick<Features extends Record<string, LazyImport<Constructor<BaseFeature>>>>(
  features: Features
) {
  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const flick = new Flick(features, resolver as any, driver)
  return { flick, driver }
}

test.group('Flick', () => {
  test('should expose the configured driver', ({ assert }) => {
    const { flick, driver } = createFlick({})

    assert.strictEqual(flick.driver, driver)
  })

  test('should return a feature resolver bound to the scope', ({ assert }) => {
    const { flick } = createFlick({})

    assert.instanceOf(flick.for(scope), FeatureResolver)
  })

  test('should resolve a feature and return its value', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'enabled'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    assert.equal(await flick.resolve('checkout', scope), 'enabled')
  })

  test('should pass the scope to the feature resolve method', async ({ assert }) => {
    let received: unknown
    class ScopeFeature extends BaseFeature {
      async resolve(s: unknown) {
        received = s
        return true
      }
    }

    const { flick } = createFlick({ scoped: async () => ({ default: ScopeFeature }) })

    await flick.resolve('scoped', scope)

    assert.strictEqual(received, scope)
  })

  test('should cache the resolved value under the scope identifier', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'enabled'
      }
    }

    const { flick, driver } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    await flick.resolve('checkout', scope)

    assert.equal(await driver.get('checkout', 'user-1'), 'enabled')
  })

  test('should only evaluate a feature once and reuse the cached value', async ({ assert }) => {
    let calls = 0
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        calls++
        return 'enabled'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    const first = await flick.resolve('checkout', scope)
    const second = await flick.resolve('checkout', scope)

    assert.equal(first, 'enabled')
    assert.equal(second, 'enabled')
    assert.equal(calls, 1)
  })

  test('should reuse cached falsy values without re-evaluating', async ({ assert }) => {
    let calls = 0
    class FalsyFeature extends BaseFeature {
      async resolve() {
        calls++
        return false
      }
    }

    const { flick } = createFlick({ falsy: async () => ({ default: FalsyFeature }) })

    const first = await flick.resolve('falsy', scope)
    const second = await flick.resolve('falsy', scope)

    assert.strictEqual(first, false)
    assert.strictEqual(second, false)
    assert.equal(calls, 1)
  })

  test('should short-circuit when the before hook returns a value', async ({ assert }) => {
    let resolveCalls = 0
    class GatedFeature extends BaseFeature {
      async before() {
        return 'forced'
      }
      async resolve() {
        resolveCalls++
        return 'resolved'
      }
    }

    const { flick, driver } = createFlick({ gated: async () => ({ default: GatedFeature }) })

    const result = await flick.resolve('gated', scope)

    assert.equal(result, 'forced')
    assert.equal(resolveCalls, 0)
    assert.isUndefined(await driver.get('gated', 'user-1'))
  })

  test('should short-circuit even when the before hook returns a falsy value', async ({
    assert,
  }) => {
    let resolveCalls = 0
    class GatedFeature extends BaseFeature {
      async before() {
        return false
      }
      async resolve() {
        resolveCalls++
        return true
      }
    }

    const { flick } = createFlick({ gated: async () => ({ default: GatedFeature }) })

    assert.strictEqual(await flick.resolve('gated', scope), false)
    assert.equal(resolveCalls, 0)
  })

  test('should fall through to resolve when the before hook returns undefined', async ({
    assert,
  }) => {
    class GatedFeature extends BaseFeature {
      async before() {
        return undefined
      }
      async resolve() {
        return 'resolved'
      }
    }

    const { flick } = createFlick({ gated: async () => ({ default: GatedFeature }) })

    assert.equal(await flick.resolve('gated', scope), 'resolved')
  })

  test('should isolate cached values per scope identifier', async ({ assert }) => {
    let calls = 0
    class CheckoutFeature extends BaseFeature {
      async resolve(s: FeatureScopeable) {
        calls++
        return s.toFeatureIdentifier()
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    const userA: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }
    const userB: FeatureScopeable = { toFeatureIdentifier: () => 'user-2' }

    assert.equal(await flick.resolve('checkout', userA), 'user-1')
    assert.equal(await flick.resolve('checkout', userB), 'user-2')
    assert.equal(calls, 2)
  })

  test('define should store a value that overrides resolve without evaluating it', async ({
    assert,
  }) => {
    let calls = 0
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        calls++
        return 'enabled'
      }
    }

    const { flick, driver } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    await flick.define('checkout', scope, 'forced')

    assert.equal(await driver.get('checkout', 'user-1'), 'forced')
    assert.equal(await flick.resolve('checkout', scope), 'forced')
    assert.equal(calls, 0)
  })

  test('define should store the value under the scope identifier', async ({ assert }) => {
    const { flick } = createFlick({ checkout: async () => ({ default: NoopFeature }) })

    const userA: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

    await flick.define('checkout', userA, 'a')

    assert.equal(await flick.driver.get('checkout', 'user-1'), 'a')
    assert.isUndefined(await flick.driver.get('checkout', 'user-2'))
  })

  test('activate should store true for the scope', async ({ assert }) => {
    let calls = 0
    class OffFeature extends BaseFeature {
      async resolve() {
        calls++
        return false
      }
    }

    const { flick } = createFlick({ off: async () => ({ default: OffFeature }) })

    await flick.activate('off', scope)

    assert.strictEqual(await flick.resolve('off', scope), true)
    assert.equal(calls, 0)
  })

  test('deactivate should store false for the scope', async ({ assert }) => {
    let calls = 0
    class OnFeature extends BaseFeature {
      async resolve() {
        calls++
        return true
      }
    }

    const { flick } = createFlick({ on: async () => ({ default: OnFeature }) })

    await flick.deactivate('on', scope)

    assert.strictEqual(await flick.resolve('on', scope), false)
    assert.equal(calls, 0)
  })

  test('clear should remove the cached value so resolve re-evaluates', async ({ assert }) => {
    let calls = 0
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        calls++
        return 'enabled'
      }
    }

    const { flick, driver } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    await flick.resolve('checkout', scope)
    await flick.clear('checkout', scope)

    assert.isUndefined(await driver.get('checkout', 'user-1'))

    await flick.resolve('checkout', scope)

    assert.equal(calls, 2)
  })

  test('purge should remove cached values for the given features', async ({ assert }) => {
    const { flick, driver } = createFlick({
      a: async () => ({ default: NoopFeature }),
      b: async () => ({ default: NoopFeature }),
    })

    await flick.define('a', scope, 'a-value')
    await flick.define('b', scope, 'b-value')

    await flick.purge(['a'])

    assert.isUndefined(await driver.get('a', 'user-1'))
    assert.equal(await driver.get('b', 'user-1'), 'b-value')
  })

  test('purge should remove every cached value when no features are given', async ({ assert }) => {
    const { flick, driver } = createFlick({
      a: async () => ({ default: NoopFeature }),
      b: async () => ({ default: NoopFeature }),
    })

    await flick.define('a', scope, 'a-value')
    await flick.define('b', scope, 'b-value')

    await flick.purge()

    assert.isUndefined(await driver.get('a', 'user-1'))
    assert.isUndefined(await driver.get('b', 'user-1'))
  })
})
