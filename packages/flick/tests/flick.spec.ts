import { test } from '@japa/runner'
import { Container } from '@adonisjs/core/container'
import { Flick } from '../src/flick.ts'
import { FeatureResolver } from '../src/feature_resolver.ts'
import { BaseFeature } from '../src/base_feature.ts'
import { FlickMemoryDriver } from '../src/drivers/memory_driver.ts'
import { FeatureScopeable } from '../src/types.ts'

const scope: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

function createFlick(features: Record<string, () => Promise<{ default: any }>>) {
  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const flick = new Flick(features as any, resolver as any, driver)
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
})
