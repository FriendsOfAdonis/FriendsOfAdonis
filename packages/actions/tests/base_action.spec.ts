import { test } from '@japa/runner'
import { BaseAction } from '../src/base_action.ts'
import { setupExecutor } from './helpers.ts'

test.group('BaseAction', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('run resolves the action through the container and invokes handle', async ({ assert }) => {
    let received: [string, number] | undefined

    class GreetAction extends BaseAction {
      handle(name: string, age: number) {
        received = [name, age]
        return `hello ${name} (${age})`
      }
    }

    const result = await GreetAction.run('alice', 30)

    assert.equal(result, 'hello alice (30)')
    assert.deepEqual(received, ['alice', 30])
  })

  test('run resolves a fresh instance per call', async ({ assert }) => {
    const seen: object[] = []

    class TrackAction extends BaseAction {
      handle() {
        seen.push(this)
      }
    }

    await TrackAction.run()
    await TrackAction.run()

    assert.lengthOf(seen, 2)
    assert.notStrictEqual(seen[0], seen[1])
  })

  test('handle gains a scoped child logger after invocation', async ({ assert }) => {
    let capturedLogger: unknown

    class LogAction extends BaseAction {
      handle() {
        capturedLogger = this.logger
      }
    }

    await LogAction.run()

    assert.exists(capturedLogger)
  })

  test('throws when no executor has been configured', async ({ assert }) => {
    BaseAction.executor = undefined

    class OrphanAction extends BaseAction {
      handle() {}
    }

    await assert.rejects(() => OrphanAction.run(), /Make sure to pass runner/)
  })

  test('handle propagates errors thrown inside the action', async ({ assert }) => {
    class FailAction extends BaseAction {
      handle() {
        throw new Error('boom')
      }
    }

    await assert.rejects(() => FailAction.run(), 'boom')
  })

  test('handle is wrapped through the executor (constructor wraps the prototype)', async ({
    assert,
  }) => {
    class WrappedAction extends BaseAction {
      handle() {
        return 'ok'
      }
    }

    const instance = new WrappedAction()
    // After construction, `handle` is redefined as an own property on the instance
    // pointing at the executor-wrapped function.
    assert.isTrue(Object.prototype.hasOwnProperty.call(instance, 'handle'))
    assert.notStrictEqual(instance.handle, WrappedAction.prototype.handle)
  })

  test('static displayName mirrors the class name', ({ assert }) => {
    class CreateUserAction extends BaseAction {
      handle() {}
    }
    assert.equal(CreateUserAction.displayName, 'CreateUserAction')
  })
})
