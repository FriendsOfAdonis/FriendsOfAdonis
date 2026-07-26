import { test } from '@japa/runner'
import { BaseAction } from '../src/base_action.ts'
import { setupExecutor } from './helpers.ts'

test.group('ActionExecutor — execute hook', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('execute hook fires before the entrypoint', async ({ assert }) => {
    const order: string[] = []

    class WatchAction extends BaseAction {
      handle() {
        order.push('handle')
      }
    }

    BaseAction.executor!.hook('execute', () => {
      order.push('hook')
    })

    await WatchAction.run()

    assert.deepEqual(order, ['hook', 'handle'])
  })

  test('cleanup callback runs after a successful entrypoint', async ({ assert }) => {
    const order: string[] = []

    class WatchAction extends BaseAction {
      handle() {
        order.push('handle')
        return 'ok'
      }
    }

    BaseAction.executor!.hook('execute', () => {
      return () => {
        order.push('cleanup')
      }
    })

    const result = await WatchAction.run()
    assert.equal(result, 'ok')
    assert.deepEqual(order, ['handle', 'cleanup'])
  })

  test('cleanup is NOT invoked when the entrypoint throws', async ({ assert }) => {
    let cleanupCalled = false

    class FailAction extends BaseAction {
      handle() {
        throw new Error('nope')
      }
    }

    BaseAction.executor!.hook('execute', () => {
      return () => {
        cleanupCalled = true
      }
    })

    await assert.rejects(() => FailAction.run(), 'nope')
    assert.isFalse(cleanupCalled)
  })

  test('hook receives the action, method, handler, and args', async ({ assert }) => {
    let captured: any

    class GreetAction extends BaseAction {
      handle(name: string) {
        return `hi ${name}`
      }
    }

    BaseAction.executor!.hook('execute', (context) => {
      captured = context
    })

    await GreetAction.run('alice')

    assert.equal(captured.method, 'handle')
    assert.instanceOf(captured.action, GreetAction)
    assert.deepEqual(captured.args, ['alice'])
    assert.isFunction(captured.handler)
  })

  test('multiple hooks run in registration order, cleanups in reverse', async ({ assert }) => {
    const order: string[] = []

    class WatchAction extends BaseAction {
      handle() {
        order.push('handle')
      }
    }

    BaseAction.executor!.hook('execute', () => {
      order.push('hook-a')
      return () => {
        order.push('cleanup-a')
      }
    })
    BaseAction.executor!.hook('execute', () => {
      order.push('hook-b')
      return () => {
        order.push('cleanup-b')
      }
    })

    await WatchAction.run()

    assert.equal(order[0], 'hook-a')
    assert.equal(order[1], 'hook-b')
    assert.equal(order[2], 'handle')
    assert.includeMembers(order.slice(3), ['cleanup-a', 'cleanup-b'])
  })
})
