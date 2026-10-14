import { test } from '@japa/runner'
import { definePermissions, prefix } from '../src/define_permissions.ts'
import { E_INVALID_PERMISSION_DEFINITION } from '../src/errors.ts'
import { permissions } from './fixtures/models.ts'

test.group('definePermissions | keys', () => {
  test('produces resource.action keys in definition order', ({ assert }) => {
    assert.deepEqual(permissions.keys(), [
      'product.create',
      'product.update',
      'product.delete',
      'product.archive',
      'billing.refund',
      'admin:user.ban',
      'admin:user.impersonate',
    ])
  })

  test('excludes inactive keys from active()', ({ assert }) => {
    assert.deepEqual(permissions.active(), [
      'product.create',
      'product.update',
      'product.delete',
      'billing.refund',
      'admin:user.ban',
      'admin:user.impersonate',
    ])
  })

  test('normalizes every entry', ({ assert }) => {
    assert.deepEqual(permissions.all(), [
      {
        key: 'product.create',
        prefix: undefined,
        resource: 'product',
        action: 'create',
        description: 'Create product',
        inactive: false,
        aliases: [],
      },
      {
        key: 'product.update',
        prefix: undefined,
        resource: 'product',
        action: 'update',
        description: 'Update products',
        inactive: false,
        aliases: [],
      },
      {
        key: 'product.delete',
        prefix: undefined,
        resource: 'product',
        action: 'delete',
        description: 'Delete products',
        inactive: false,
        aliases: ['product.remove'],
      },
      {
        key: 'product.archive',
        prefix: undefined,
        resource: 'product',
        action: 'archive',
        description: 'Archive products',
        inactive: true,
        aliases: [],
      },
      {
        key: 'billing.refund',
        prefix: undefined,
        resource: 'billing',
        action: 'refund',
        description: 'Issue refunds',
        inactive: false,
        aliases: [],
      },
      {
        key: 'admin:user.ban',
        prefix: 'admin',
        resource: 'user',
        action: 'ban',
        description: 'Ban user',
        inactive: false,
        aliases: [],
      },
      {
        key: 'admin:user.impersonate',
        prefix: 'admin',
        resource: 'user',
        action: 'impersonate',
        description: 'Impersonate users',
        inactive: false,
        aliases: [],
      },
    ])
  })

  test('generates readable descriptions from snake and kebab case names', ({ assert }) => {
    const defined = definePermissions({
      blog_post: { 'mass_delete': true, 'soft-delete': {} },
    })

    assert.deepEqual(
      defined.all().map((entry) => entry.description),
      ['Mass delete blog post', 'Soft delete blog post']
    )
  })

  test('returns frozen entries', ({ assert }) => {
    const [entry] = permissions.all()
    assert.isTrue(Object.isFrozen(entry))
    assert.throws(() => {
      ;(entry as { key: string }).key = 'hacked.key'
    })
    assert.equal(permissions.all()[0].key, 'product.create')
  })

  test('merges several definitions and prefixes', ({ assert }) => {
    const defined = definePermissions(
      prefix('admin', { product: { create: true } }),
      { product: { create: true } },
      prefix('admin', { billing: { refund: true } })
    )

    assert.deepEqual(defined.keys(), [
      'admin:product.create',
      'product.create',
      'admin:billing.refund',
    ])
  })

  test('returns the plain shape from prefix()', ({ assert }) => {
    assert.deepEqual(prefix('admin', { user: { ban: true } }), {
      prefix: 'admin',
      resources: { user: { ban: true } },
    })
  })

  test('finds entries by key or alias', ({ assert }) => {
    assert.equal(permissions.find('product.delete')?.key, 'product.delete')
    assert.equal(permissions.find('product.remove')?.key, 'product.delete')
    assert.isUndefined(permissions.find('product.*'))
    assert.isUndefined(permissions.find('order.create'))
  })
})

test.group('definePermissions | isGrant', () => {
  test('{$self}')
    .with([
      { value: 'product.create', expected: true },
      { value: 'product.archive', expected: true },
      { value: 'admin:user.ban', expected: true },
      { value: '*', expected: true },
      { value: 'product.*', expected: true },
      { value: 'admin:*', expected: true },
      { value: 'admin:user.*', expected: true },
      { value: 'product.remove', expected: false },
      { value: 'product.craete', expected: false },
      { value: 'order.*', expected: false },
      { value: 'user.*', expected: false },
      { value: 'staff:*', expected: false },
      { value: 'admin:product.*', expected: false },
      { value: '*.create', expected: false },
      { value: 'product', expected: false },
      { value: '', expected: false },
      { value: 42, expected: false },
      { value: null, expected: false },
    ])
    .run(({ assert }, { value, expected }) => {
      assert.equal(permissions.isGrant(value), expected)
    })

  test('works when passed as a callback', ({ assert }) => {
    const input: unknown[] = ['product.create', 'product.remove', '*', 42]

    assert.deepEqual(input.filter(permissions.isGrant), ['product.create', '*'])
  })
})

test.group('definePermissions | validation', () => {
  test('rejects a {$self}')
    .with([
      {
        title: 'duplicate key',
        definitions: [{ product: { create: true } }, { product: { create: 'Again' } }],
        message: 'Duplicate permission "product.create". Each key must be defined once',
      },
      {
        title: 'duplicate prefixed key',
        definitions: [prefix('a', { p: { c: true } }), prefix('a', { p: { c: true } })],
        message: 'Duplicate permission "a:p.c". Each key must be defined once',
      },
      {
        title: 'alias equal to an existing key',
        definitions: [{ product: { create: true, delete: { aliases: ['product.create'] } } }],
        message:
          'Alias "product.create" of permission "product.delete" collides with an existing permission key',
      },
      {
        title: 'alias equal to a key defined later',
        definitions: [
          { product: { delete: { aliases: ['billing.refund'] } } },
          { billing: { refund: true } },
        ],
        message:
          'Alias "billing.refund" of permission "product.delete" collides with an existing permission key',
      },
      {
        title: 'alias claimed twice',
        definitions: [
          {
            product: {
              delete: { aliases: ['product.remove'] },
              destroy: { aliases: ['product.remove'] },
            },
          },
        ],
        message: 'Alias "product.remove" is claimed by both "product.delete" and "product.destroy"',
      },
      {
        title: 'malformed alias',
        definitions: [{ product: { delete: { aliases: ['remove'] } } }],
        message:
          'Invalid alias "remove" for permission "product.delete". Aliases must look like "resource.action" or "prefix:resource.action"',
      },
      {
        title: 'invalid resource name',
        definitions: [{ 'pro duct': { create: true } }],
        message:
          'Invalid permission resource "pro duct". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'invalid action name',
        definitions: [{ product: { 'create.all': true } }],
        message:
          'Invalid permission action "create.all". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'invalid prefix name',
        definitions: [prefix('ad:min', { product: { create: true } })],
        message:
          'Invalid permission prefix "ad:min". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'non object actions',
        definitions: [{ product: 'create' }],
        message: 'Invalid actions for resource "product". Expected an object',
      },
      {
        title: 'invalid action definition',
        definitions: [{ product: { create: false } }],
        message:
          'Invalid definition for permission "product.create". Expected true, a description or an object',
      },
    ])
    .run(({ assert }, { definitions, message }) => {
      assert.throws(
        () => (definePermissions as (...values: unknown[]) => unknown)(...definitions),
        message
      )

      try {
        ;(definePermissions as (...values: unknown[]) => unknown)(...definitions)
      } catch (error) {
        assert.instanceOf(error, E_INVALID_PERMISSION_DEFINITION)
        assert.equal((error as { code: string }).code, 'E_INVALID_PERMISSION_DEFINITION')
      }
    })
})
