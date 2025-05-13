import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { test } from '@japa/runner'
import { SparkFactory } from '../factories/spark_factory.js'

test.group('Spark', () => {
  test('location', () => {})

  test('hello', async ({ expect }) => {
    const ctx = new HttpContextFactory().create()
    const spark = await new SparkFactory().merge({ ctx }).create()

    const result = await spark
      .createRenderer()
      .render(<div>Hello</div>)
      .toString()

    expect(result).toBe('<div>Hello</div>')
  })
})
