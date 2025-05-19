import 'reflect-metadata'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { test } from '@japa/runner'
import SparkMiddleware from '../src/middleware.js'
import { SparkManager } from '../src/spark_manager.js'
import { SparkNode } from '../src/jsx/index.js'
import { awaitStream } from './helpers.js'
import { Logger } from '@adonisjs/core/logger'

test.group('middleware', () => {
  const factory = new HttpContextFactory()

  const spark = new SparkManager(
    {
      resolve: async (constructor) => new constructor(),
    },
    new Logger({}),
    {
      layout: () => async () => ({ default: ({ children }: { children: SparkNode }) => children }),
    }
  )

  const middleware = new SparkMiddleware(spark)

  test('should not alter non JSX responses', async ({ expect }) => {
    const ctx = factory.create()

    ctx.response.lazyBody = { content: ['Hello world', true] }

    await middleware.handle(ctx, () => {})

    expect(ctx.response.hasContent).toBe(true)
    expect(ctx.response.hasStream).toBe(false)
    expect(ctx.response.content?.[0]).toBe('Hello world')
  })

  test('should stream JSX', async ({ expect }) => {
    const ctx = factory.create()

    ctx.response.lazyBody = { content: [<div>JSX</div>, true] }

    await middleware.handle(ctx, () => {})

    expect(ctx.response.hasContent).toBe(false)
    expect(ctx.response.hasStream).toBe(true)

    const readable = ctx.response.outgoingStream!

    const result = await awaitStream(readable)

    expect(result).toBe('<div>JSX</div>')
  })
})
