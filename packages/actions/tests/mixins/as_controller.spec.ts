import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { type HttpContext } from '@adonisjs/core/http'
import { BaseAction } from '../../src/base_action.ts'
import { AsController } from '../../src/mixins/as_controller.ts'
import { setupExecutor } from '../helpers.ts'

function fakeHttpContext(): HttpContext {
  return {} as HttpContext
}

test.group('AsController mixin', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('asController is reachable through the executor', async ({ assert }) => {
    let called = false

    class CreateUserAction extends compose(BaseAction, AsController()) {
      handle() {}
      async asController(_ctx: HttpContext) {
        called = true
        return 'response'
      }
    }

    const action = new CreateUserAction()
    const result = await action.asController(fakeHttpContext())

    assert.isTrue(called)
    assert.equal(result, 'response')
  })

  test('throws E_NOT_IMPLEMENTED_EXCEPTION when asController is not overridden', async ({
    assert,
  }) => {
    class IncompleteAction extends compose(BaseAction, AsController()) {
      handle() {}
    }

    const action = new IncompleteAction()
    await assert.rejects(
      () => action.asController(fakeHttpContext()),
      /uses AsController but does not implement the method asController/
    )
  })

  test('handle is still callable on a controller-composed action', async ({ assert }) => {
    let handleCalled = false

    class HybridAction extends compose(BaseAction, AsController()) {
      handle() {
        handleCalled = true
        return 42
      }
      async asController(_ctx: HttpContext) {
        return this.handle()
      }
    }

    const result = await HybridAction.run()
    assert.equal(result, 42)
    assert.isTrue(handleCalled)
  })

  test('multiple mixins can be composed together', async ({ assert }) => {
    const { AsListener } = await import('../../src/mixins/as_listener.ts')

    class MultiAction extends compose(BaseAction, AsController(), AsListener<{ id: string }>()) {
      handle() {
        return 'handled'
      }
      async asController(_ctx: HttpContext) {
        return 'http'
      }
      async asListener(_event: { id: string }) {
        return 'event'
      }
    }

    const action = new MultiAction()
    assert.equal(await MultiAction.run(), 'handled')
    assert.equal(await action.asController(fakeHttpContext()), 'http')
    assert.equal(await action.asListener({ id: '1' }), 'event')
  })
})
