import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { type BaseCommand } from '@adonisjs/core/ace'
import { BaseAction } from '../../src/base_action.ts'
import { AsCommand } from '../../src/mixins/as_command.ts'
import { setupExecutor } from '../helpers.ts'

test.group('AsCommand mixin', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('passed options are stored on the static $commandOptions', ({ assert }) => {
    class CreateUserAction extends compose(
      BaseAction,
      AsCommand({ commandName: 'users:create', description: 'Create a user' })
    ) {
      handle() {}
      async asCommand(_command: BaseCommand) {}
    }

    assert.deepEqual(CreateUserAction.$commandOptions, {
      commandName: 'users:create',
      description: 'Create a user',
    })
  })

  test('defaults to an empty $commandOptions when none are passed', ({ assert }) => {
    class CleanupAction extends compose(BaseAction, AsCommand()) {
      handle() {}
      async asCommand(_command: BaseCommand) {}
    }

    assert.deepEqual(CleanupAction.$commandOptions, {})
  })

  test('asCommand is reachable through the executor', async ({ assert }) => {
    let called = false

    class RunAction extends compose(BaseAction, AsCommand()) {
      handle() {}
      async asCommand(_command: BaseCommand) {
        called = true
      }
    }

    const action = new RunAction()
    await action.asCommand({} as BaseCommand)
    assert.isTrue(called)
  })

  test('throws E_NOT_IMPLEMENTED_EXCEPTION when asCommand is not overridden', async ({
    assert,
  }) => {
    class IncompleteAction extends compose(BaseAction, AsCommand()) {
      handle() {}
    }

    const action = new IncompleteAction()
    await assert.rejects(
      () => action.asCommand({} as BaseCommand),
      /uses AsCommand but does not implement the method asCommand/
    )
  })
})
