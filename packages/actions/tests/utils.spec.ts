import { test } from '@japa/runner'
import {
  generateCommandName,
  parseLazyImportSpecifier,
  implementsAsController,
  implementsAsListener,
  implementsAsCommand,
} from '../src/utils.ts'
import { BaseAction } from '../src/base_action.ts'

test.group('Utils — generateCommandName', () => {
  test('converts PascalCase action name into action:dash-cased', ({ assert }) => {
    assert.equal(generateCommandName('CreateUserAction'), 'action:create-user')
  })

  test('strips the trailing Action suffix only once', ({ assert }) => {
    assert.equal(generateCommandName('SendWelcomeEmailAction'), 'action:send-welcome-email')
  })

  test('handles class names without the Action suffix', ({ assert }) => {
    assert.equal(generateCommandName('SyncUsers'), 'action:sync-users')
  })

  test('handles single-word names', ({ assert }) => {
    assert.equal(generateCommandName('CleanupAction'), 'action:cleanup')
  })
})

test.group('Utils — parseLazyImportSpecifier', () => {
  test('extracts the module path from a lazy import thunk', ({ assert }) => {
    // We only need the string form; the path doesn't have to resolve.
    const thunk = "() => import('./create_user_action.js')"
    assert.equal(parseLazyImportSpecifier(thunk), './create_user_action.js')
  })

  test("returns 'closure' when no import literal is present", ({ assert }) => {
    assert.equal(parseLazyImportSpecifier('() => doSomething()'), 'closure')
  })
})

test.group('Utils — type guards', () => {
  test('implementsAsController returns true when asController is defined', ({ assert }) => {
    const action = { asController: () => {} } as any
    assert.isTrue(implementsAsController(action as BaseAction))
  })

  test('implementsAsController returns false when asController is missing', ({ assert }) => {
    const action = {} as any
    assert.isFalse(implementsAsController(action as BaseAction))
  })

  test('implementsAsListener returns true when asListener is defined', ({ assert }) => {
    const action = { asListener: () => {} } as any
    assert.isTrue(implementsAsListener(action as BaseAction))
  })

  test('implementsAsCommand returns true when asCommand is defined', ({ assert }) => {
    const action = { asCommand: () => {} } as any
    assert.isTrue(implementsAsCommand(action as BaseAction))
  })
})
