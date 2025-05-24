import { test } from '@japa/runner'
import { FakeTransport } from '../../src/transports/fake_transport.js'
import { AssertionError } from 'node:assert'

test.group('FakeTransport', () => {
  test('assertCount', async ({ assert }) => {
    const transport = new FakeTransport()

    transport.assertCount(0)
    assert.throws(() => transport.assertCount(1), AssertionError as any)

    await transport.send('1', 'log', { level: 'log', message: 'Hello World!' })

    transport.assertCount(1)
    assert.throws(() => transport.assertCount(0), AssertionError as any)

    await transport.send('1', 'log', { level: 'log', message: 'Hello World!' })
    await transport.send('1', 'alert', { message: 'Boo' })

    transport.assertCount(3)
    transport.assertCount(1, (message) => message.name === 'alert')
  })

  test('assertSent', async ({ assert }) => {
    const transport = new FakeTransport()

    assert.throws(() => transport.assertSent('log'), AssertionError as any)

    await transport.send('1', 'log', { level: 'log', message: 'Hello World!' })

    transport.assertSent('log')
    assert.throws(() => transport.assertSent('alert'), AssertionError as any)

    await transport.send('1', 'log', { level: 'error', message: 'Hello World!' })
    await transport.send('1', 'alert', { message: 'Boo' })

    transport.assertSent('log')
    transport.assertSent('alert')
    transport.assertSent('log', (message) => message.payload.level === 'error')
    assert.throws(
      () => transport.assertSent('log', (message) => message.payload.level === 'debug'),
      AssertionError as any
    )
  })

  test('clear', async () => {
    const transport = new FakeTransport()

    transport.assertCount(0)

    await transport.send('1', 'log', { level: 'log', message: 'Hello World!' })

    transport.assertCount(1)

    transport.clear()

    transport.assertCount(0)
  })
})
