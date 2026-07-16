import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseAction } from '../../src/base_action.ts'
import { AsListener } from '../../src/mixins/as_listener.ts'
import { setupExecutor } from '../helpers.ts'

interface UserCreated {
  userId: string
}

test.group('AsListener mixin', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('asListener is reachable through the executor', async ({ assert }) => {
    let received: UserCreated | undefined

    class WelcomeAction extends compose(BaseAction, AsListener<UserCreated>()) {
      handle() {}
      async asListener(event: UserCreated) {
        received = event
      }
    }

    const action = new WelcomeAction()
    await action.asListener({ userId: 'u-1' })

    assert.deepEqual(received, { userId: 'u-1' })
  })

  test('throws E_NOT_IMPLEMENTED_EXCEPTION when asListener is not overridden', async ({
    assert,
  }) => {
    class IncompleteAction extends compose(BaseAction, AsListener<UserCreated>()) {
      handle() {}
    }

    const action = new IncompleteAction()
    await assert.rejects(
      () => action.asListener({ userId: 'u-1' }),
      /uses AsListener but does not implement the method asListener/
    )
  })
})
