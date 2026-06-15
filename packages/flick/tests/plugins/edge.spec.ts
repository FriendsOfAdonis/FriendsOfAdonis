import { test } from '@japa/runner'
import { Edge } from 'edge.js'
import { Container } from '@adonisjs/core/container'
import { Flick } from '../../src/flick.ts'
import { BaseFeature } from '../../src/base_feature.ts'
import { FlickMemoryDriver } from '../../src/drivers/memory_driver.ts'
import { FeatureScopeable, FlickService } from '../../src/types.ts'
import { edgePluginFlick } from '../../src/plugins/edge.ts'

const scope: FeatureScopeable = { toFeatureIdentifier: () => 'user-1' }

class ActiveFeature extends BaseFeature {
  async resolve() {
    return true
  }
}

class InactiveFeature extends BaseFeature {
  async resolve() {
    return false
  }
}

class ZeroFeature extends BaseFeature {
  async resolve() {
    return 0
  }
}

class ThemeFeature extends BaseFeature {
  async resolve() {
    return 'dark'
  }
}

function createEdge() {
  const driver = new FlickMemoryDriver()
  const resolver = new Container().createResolver()
  const flick = new Flick(
    {
      checkout: async () => ({ default: ActiveFeature }),
      beta: async () => ({ default: InactiveFeature }),
      zero: async () => ({ default: ZeroFeature }),
      theme: async () => ({ default: ThemeFeature }),
    } as any,
    resolver as any,
    driver
  )

  const edge = Edge.create()
  edge.use(edgePluginFlick(flick as unknown as FlickService))
  return edge
}

test.group('edge plugin', () => {
  test('@feature renders its block when the feature is active', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`@feature('checkout', scope)\nYES\n@else\nNO\n@end`, { scope })

    assert.equal(out.trim(), 'YES')
  })

  test('@feature renders the @else branch when the feature is inactive', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`@feature('beta', scope)\nYES\n@else\nNO\n@end`, { scope })

    assert.equal(out.trim(), 'NO')
  })

  test('@feature treats a falsy value as inactive', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`@feature('zero', scope)\nYES\n@else\nNO\n@end`, { scope })

    assert.equal(out.trim(), 'NO')
  })

  test('@featureInactive renders when the feature is inactive', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`@featureInactive('beta', scope)\nNOPE\n@end`, { scope })

    assert.equal(out.trim(), 'NOPE')
  })

  test('@featureInactive renders nothing when the feature is active', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`@featureInactive('checkout', scope)\nNOPE\n@end`, { scope })

    assert.equal(out.trim(), '')
  })

  test('exposes the flick service as a global usable in @if', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(
      `@if(await flick.for(scope).isActive('checkout'))\nYES\n@end`,
      { scope }
    )

    assert.equal(out.trim(), 'YES')
  })

  test('exposes the flick service as a global to read raw values', async ({ assert }) => {
    const edge = createEdge()
    const out = await edge.renderRaw(`{{ await flick.for(scope).value('theme') }}`, { scope })

    assert.equal(out.trim(), 'dark')
  })

  test('throws at compile time when the scope argument is missing', async ({ assert }) => {
    const edge = createEdge()

    await assert.rejects(
      () => edge.renderRaw(`@feature('checkout')\nYES\n@end`, { scope }),
      /expects exactly two arguments/
    )
  })
})
