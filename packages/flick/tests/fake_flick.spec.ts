import { test } from '@japa/runner'
import { AssertionError } from 'node:assert'
import { Constructor, LazyImport } from '@adonisjs/core/types/common'
import { Container } from '@adonisjs/core/container'
import { Flick } from '../src/flick.ts'
import { BaseFeature } from '../src/base_feature.ts'
import { FlickMemoryDriver } from '../src/drivers/memory_driver.ts'
import { FeatureScopeable } from '../src/types.ts'

const scope: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

function createFlick<F extends Record<string, LazyImport<Constructor<BaseFeature>>>>(features: F) {
  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const flick = new Flick(features, resolver as any, driver)
  return { flick, driver }
}

test.group('FakeFlick', () => {
  test('should return the faked value for an overridden feature', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    flick.fake().override('checkout', 'faked')

    assert.equal(await flick.resolve('checkout', scope), 'faked')
  })

  test('should never evaluate the real feature when faked', async ({ assert }) => {
    let calls = 0
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        calls++
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    flick.fake().override('checkout', 'faked')
    await flick.resolve('checkout', scope)

    assert.equal(calls, 0)
  })

  test('should call function overrides with the scope', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature<FeatureScopeable> {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    flick.fake().override('checkout', (s) => `faked-${s.toFeatureIdentifier()}`)

    assert.equal(await flick.resolve('checkout', scope), 'faked-user-1')
  })

  test('should pass through to real resolution for non-faked features', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'checkout'
      }
    }
    class BannerFeature extends BaseFeature {
      async resolve() {
        return 'banner'
      }
    }

    const { flick } = createFlick({
      checkout: async () => ({ default: CheckoutFeature }),
      banner: async () => ({ default: BannerFeature }),
    })

    flick.fake().override('checkout', 'faked')

    assert.equal(await flick.resolve('checkout', scope), 'faked')
    assert.equal(await flick.resolve('banner', scope), 'banner')
  })

  test('should fake falsy values', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return true
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    flick.fake().override('checkout', false)

    assert.strictEqual(await flick.resolve('checkout', scope), false)
  })

  test('assertResolved should pass when the feature was resolved', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    const fake = flick.fake().override('checkout', 'faked')
    await flick.resolve('checkout', scope)

    assert.doesNotThrow(() => fake.assertResolved('checkout'))
  })

  test('assertResolved should throw when the feature was not resolved', ({ assert }) => {
    const { flick } = createFlick({})

    const fake = flick.fake()

    assert.throws(() => fake.assertResolved('checkout' as never), AssertionError)
  })

  test('assertNotResolved should throw when the feature was resolved', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    const fake = flick.fake().override('checkout', 'faked')
    await flick.resolve('checkout', scope)

    assert.throws(() => fake.assertNotResolved('checkout'), AssertionError)
  })

  test('assertResolvedFor should match the scope identifier', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })
    const userA: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }
    const userB: FeatureScopeable = { toFeatureIdentifier: () => 'user-2' }

    const fake = flick.fake().override('checkout', 'faked')
    await flick.resolve('checkout', userA)

    assert.doesNotThrow(() => fake.assertResolvedFor('checkout', userA))
    assert.throws(() => fake.assertResolvedFor('checkout', userB), AssertionError)
  })

  test('restore should resume real resolution', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    const fake = flick.fake().override('checkout', 'faked')
    assert.equal(await flick.resolve('checkout', scope), 'faked')

    fake.restore()
    assert.equal(await flick.resolve('checkout', scope), 'real')
  })

  test('using should restore real resolution at scope end', async ({ assert }) => {
    class CheckoutFeature extends BaseFeature {
      async resolve() {
        return 'real'
      }
    }

    const { flick } = createFlick({ checkout: async () => ({ default: CheckoutFeature }) })

    async function scoped() {
      using _fake = flick.fake().override('checkout', 'faked')
      assert.equal(await flick.resolve('checkout', scope), 'faked')
    }

    await scoped()

    assert.equal(await flick.resolve('checkout', scope), 'real')
  })
})
