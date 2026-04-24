import { test } from '@japa/runner'
import { loader } from '../src/loader.ts'
import { flattenActions, toGirouetteControllers } from '../modules/girouette.ts'

test.group('loader', () => {
  test('tags the returned object with $type = "loader"', ({ assert }) => {
    const fn = () => Promise.resolve({ default: class {} as any })
    const l = loader(fn)
    assert.equal(l.$type, 'loader')
  })

  test('exposes the original lazy import', ({ assert }) => {
    const fn = () => Promise.resolve({ default: class {} as any })
    const l = loader(fn)
    assert.strictEqual(l.import, fn)
  })

  test('asController returns the [import, "asController"] tuple', ({ assert }) => {
    const fn = () => Promise.resolve({ default: class {} as any })
    const l = loader(fn) as any
    assert.deepEqual(l.asController(), [fn, 'asController'])
  })

  test('asListener returns the [import, "asListener"] tuple', ({ assert }) => {
    const fn = () => Promise.resolve({ default: class {} as any })
    const l = loader(fn) as any
    assert.deepEqual(l.asListener(), [fn, 'asListener'])
  })
})

test.group('flattenActions', () => {
  test('returns a single-level list of loaders unchanged', ({ assert }) => {
    const a = loader(() => Promise.resolve({ default: class {} as any }))
    const b = loader(() => Promise.resolve({ default: class {} as any }))

    const result = flattenActions({ A: a, B: b })
    assert.lengthOf(result, 2)
    assert.includeMembers(result, [a, b])
  })

  test('walks nested objects and collects every loader', ({ assert }) => {
    const a = loader(() => Promise.resolve({ default: class {} as any }))
    const b = loader(() => Promise.resolve({ default: class {} as any }))
    const c = loader(() => Promise.resolve({ default: class {} as any }))

    const result = flattenActions({
      Auth: { Login: a, Register: b },
      Billing: { Charge: c },
    })

    assert.lengthOf(result, 3)
    assert.includeMembers(result, [a, b, c])
  })

  test('handles deeply nested trees', ({ assert }) => {
    const deep = loader(() => Promise.resolve({ default: class {} as any }))
    const result = flattenActions({
      Level1: { Level2: { Level3: { Leaf: deep } } },
    })
    assert.deepEqual(result, [deep])
  })
})

test.group('toGirouetteControllers', () => {
  test('returns the lazy imports from every loader', ({ assert }) => {
    const fnA = () => Promise.resolve({ default: class {} as any })
    const fnB = () => Promise.resolve({ default: class {} as any })

    const result = toGirouetteControllers({
      Auth: { Login: loader(fnA) },
      Billing: { Charge: loader(fnB) },
    })

    assert.lengthOf(result, 2)
    assert.includeMembers(result, [fnA, fnB])
  })

  test('returns an empty array when given an empty object', ({ assert }) => {
    assert.deepEqual(toGirouetteControllers({}), [])
  })
})
