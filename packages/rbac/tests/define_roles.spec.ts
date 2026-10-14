import { test } from '@japa/runner'
import { defineRoles } from '../src/define_roles.ts'
import { E_INVALID_ROLE_DEFINITION } from '../src/errors.ts'
import { permissions, roles } from './fixtures/models.ts'

test.group('defineRoles', () => {
  test('lists the role names in definition order', ({ assert }) => {
    assert.deepEqual(roles.names(), ['editor', 'billing_manager', 'admin'])
  })

  test('normalizes every role', ({ assert }) => {
    assert.deepEqual(roles.all(), [
      {
        name: 'editor',
        description: 'Manages the catalog',
        permissions: ['product.create', 'product.update'],
      },
      { name: 'billing_manager', description: 'Billing manager', permissions: ['billing.refund'] },
      { name: 'admin', description: 'Full access', permissions: ['*'] },
    ])
  })

  test('returns frozen roles', ({ assert }) => {
    const [role] = roles.all()
    assert.isTrue(Object.isFrozen(role))
    assert.isTrue(Object.isFrozen(role.permissions))
  })

  test('finds a role by name', ({ assert }) => {
    assert.equal(roles.find('editor')?.description, 'Manages the catalog')
    assert.isUndefined(roles.find('moderator'))
  })

  test('exposes the permissions it was defined with', ({ assert }) => {
    assert.strictEqual(roles.permissions, permissions)
  })

  test('collects the grants of the named roles, ignoring unknown names', ({ assert }) => {
    assert.deepEqual(roles.grantsOf(['editor', 'moderator', 'billing_manager', 'editor']), [
      'product.create',
      'product.update',
      'billing.refund',
    ])
  })

  test('isRole {value}')
    .with([
      { value: 'editor', expected: true },
      { value: 'moderator', expected: false },
      { value: 'toString', expected: false },
      { value: 42, expected: false },
    ])
    .run(({ assert }, { value, expected }) => {
      assert.equal(roles.isRole(value), expected)
    })

  test('isRole works when passed as a callback', ({ assert }) => {
    assert.deepEqual(['editor', 'moderator', 'admin'].filter(roles.isRole), ['editor', 'admin'])
  })

  test('rejects {title}')
    .with([
      {
        title: 'an invalid role name',
        definition: { 'super admin': { permissions: ['*'] } },
        message: 'Invalid role name "super admin". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'an unknown grant',
        definition: { editor: { permissions: ['product.craete'] } },
        message:
          'Invalid grant "product.craete" in role "editor". Expected a defined permission key or wildcard',
      },
      {
        title: 'an alias used as a grant',
        definition: { editor: { permissions: ['product.remove'] } },
        message:
          'Invalid grant "product.remove" in role "editor". Expected a defined permission key or wildcard',
      },
      {
        title: 'a role without permissions list',
        definition: { editor: {} },
        message: 'Invalid role "editor". Expected an object with a "permissions" list',
      },
    ])
    .run(({ assert }, { definition, message }) => {
      const define = defineRoles as unknown as (permissions: unknown, roles: unknown) => unknown

      assert.throws(() => define(permissions, definition), message)

      try {
        define(permissions, definition)
      } catch (error) {
        assert.instanceOf(error, E_INVALID_ROLE_DEFINITION)
        assert.equal((error as { code: string }).code, 'E_INVALID_ROLE_DEFINITION')
      }
    })
})
