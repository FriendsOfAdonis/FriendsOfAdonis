import { test } from '@japa/runner'
import { SparkFactory } from '../../factories/spark_factory.js'
import { Counter } from '../fixtures/components/counter.js'
import { AssertionError } from 'node:assert'

test.group('TestableComponent', () => {
  test('assertProps', async ({ assert }) => {
    const spark = await new SparkFactory().create()

    const component = await spark.test(Counter, { id: '5' })

    component.assertProps({
      id: '5',
    })

    assert.throws(() => component.assertProps({ id: '6' }), AssertionError as any)
  })

  test('setProps', async () => {
    const spark = await new SparkFactory().create()

    const component = await spark.test(Counter, { id: '5' })

    component.assertProps({
      id: '5',
    })

    component.setProps({
      id: '6',
    })

    component.assertProps({
      id: '6',
    })
  })

  test('call', async ({ assert }) => {
    const spark = await new SparkFactory().create()

    const component = await spark.test(Counter, { id: '1' })

    assert.equal(component.component.count, 0)

    await component.call('increment')

    assert.equal(component.component.count, 1)
  })
})
