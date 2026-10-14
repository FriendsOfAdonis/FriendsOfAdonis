import { test } from '@japa/runner'
import { definePermissions } from '../src/define_permissions.ts'
import { E_INVALID_PERMISSION_DEFINITION } from '../src/errors.ts'
import { permissions } from './fixtures/models.ts'

test.group('definePermissions | keys', () => {
  test('produces dot path keys in definition order', ({ assert }) => {
    assert.deepEqual(permissions.keys(), [
      'product.create',
      'product.update',
      'product.delete',
      'product.archive',
      'billing.refund',
      'admin.user.ban',
      'admin.user.impersonate',
    ])
  })

  test('excludes inactive keys from active()', ({ assert }) => {
    assert.deepEqual(permissions.active(), [
      'product.create',
      'product.update',
      'product.delete',
      'billing.refund',
      'admin.user.ban',
      'admin.user.impersonate',
    ])
  })

  test('normalizes every entry', ({ assert }) => {
    assert.deepEqual(permissions.all(), [
      {
        key: 'product.create',
        path: ['product', 'create'],
        description: 'Create product',
        inactive: false,
      },
      {
        key: 'product.update',
        path: ['product', 'update'],
        description: 'Update products',
        inactive: false,
      },
      {
        key: 'product.delete',
        path: ['product', 'delete'],
        description: 'Delete products',
        inactive: false,
      },
      {
        key: 'product.archive',
        path: ['product', 'archive'],
        description: 'Archive products',
        inactive: true,
      },
      {
        key: 'billing.refund',
        path: ['billing', 'refund'],
        description: 'Issue refunds',
        inactive: false,
      },
      {
        key: 'admin.user.ban',
        path: ['admin', 'user', 'ban'],
        description: 'Ban user',
        inactive: false,
      },
      {
        key: 'admin.user.impersonate',
        path: ['admin', 'user', 'impersonate'],
        description: 'Impersonate users',
        inactive: false,
      },
    ])
  })

  test('nests namespaces at any depth', ({ assert }) => {
    const defined = definePermissions({
      shop: { catalog: { product: { publish: true } }, order: { refund: true } },
    })

    assert.deepEqual(defined.keys(), ['shop.catalog.product.publish', 'shop.order.refund'])
    assert.equal(defined.find('shop.catalog.product.publish')?.description, 'Publish product')
  })

  test('generates readable descriptions from snake and kebab case names', ({ assert }) => {
    const defined = definePermissions({
      blog_post: { 'mass_delete': true, 'soft-delete': true },
    })

    assert.deepEqual(
      defined.all().map((entry) => entry.description),
      ['Mass delete blog post', 'Soft delete blog post']
    )
  })

  test('marks every key of an inactive namespace as inactive', ({ assert }) => {
    const defined = definePermissions(
      { admin: { user: { ban: true }, team: { create: true } }, post: { create: true } },
      { inactive: ['admin.user'] }
    )

    assert.deepEqual(defined.active(), ['admin.team.create', 'post.create'])
    assert.isTrue(defined.find('admin.user.ban')?.inactive)
  })

  test('returns frozen entries', ({ assert }) => {
    const [entry] = permissions.all()
    assert.isTrue(Object.isFrozen(entry))
    assert.isTrue(Object.isFrozen(entry.path))
    assert.throws(() => {
      ;(entry as { key: string }).key = 'hacked.key'
    })
    assert.equal(permissions.all()[0].key, 'product.create')
  })

  test('finds entries by key or alias', ({ assert }) => {
    assert.equal(permissions.find('product.delete')?.key, 'product.delete')
    assert.equal(permissions.find('product.remove')?.key, 'product.delete')
    assert.equal(permissions.find('backoffice.user.ban')?.key, 'admin.user.ban')
    assert.isUndefined(permissions.find('product.*'))
    assert.isUndefined(permissions.find('admin.user'))
    assert.isUndefined(permissions.find('order.create'))
  })

  test('returns the canonical form of {value}')
    .with([
      { value: 'product.remove', expected: 'product.delete' },
      { value: 'backoffice.user.ban', expected: 'admin.user.ban' },
      { value: 'backoffice.*', expected: 'admin.*' },
      { value: 'backoffice.user.*', expected: 'admin.user.*' },
      { value: 'product.create', expected: 'product.create' },
      { value: 'order.create', expected: 'order.create' },
      { value: '*', expected: '*' },
    ])
    .run(({ assert }, { value, expected }) => {
      assert.equal(permissions.canonical(value), expected)
    })

  test('lists the aliases of a key, including namespace aliases', ({ assert }) => {
    assert.deepEqual(permissions.aliasesOf('product.delete'), ['product.remove'])
    assert.deepEqual(permissions.aliasesOf('admin.user.ban'), ['backoffice.user.ban'])
    assert.deepEqual(permissions.aliasesOf('product.create'), [])
  })

  test('rewrites a nested alias of a namespace', ({ assert }) => {
    const defined = definePermissions(
      { admin: { user: { ban: true } } },
      { aliases: { 'legacy.all': 'admin' } }
    )

    assert.deepEqual(defined.resolve(['legacy.all.*']), ['admin.user.ban'])
    assert.deepEqual(defined.resolve(['legacy.all.user.ban']), ['admin.user.ban'])
  })

  test('skips namespace aliases shadowed by a longer alias', ({ assert }) => {
    const defined = definePermissions(
      { store: { product: { create: true } }, catalog: { item: { create: true } } },
      { aliases: { 'shop': 'store', 'shop.product': 'catalog.item' } }
    )

    assert.deepEqual(defined.aliasesOf('store.product.create'), [])
    assert.deepEqual(defined.aliasesOf('catalog.item.create'), ['shop.product.create'])
    assert.equal(defined.canonical('shop.product.create'), 'catalog.item.create')
  })
})

test.group('definePermissions | isGrant', () => {
  test('{$self}')
    .with([
      { value: 'product.create', expected: true },
      { value: 'product.archive', expected: true },
      { value: 'admin.user.ban', expected: true },
      { value: '*', expected: true },
      { value: 'product.*', expected: true },
      { value: 'admin.*', expected: true },
      { value: 'admin.user.*', expected: true },
      { value: 'product.remove', expected: false },
      { value: 'backoffice.*', expected: false },
      { value: 'product.craete', expected: false },
      { value: 'product.create.*', expected: false },
      { value: 'order.*', expected: false },
      { value: 'user.*', expected: false },
      { value: 'admin.*.ban', expected: false },
      { value: '*.create', expected: false },
      { value: 'admin.user', expected: false },
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
  test('rejects {title}')
    .with([
      {
        title: 'an action at the root',
        tree: { export: true },
        options: undefined,
        message:
          'Invalid permission "export". Permissions must be nested under at least one namespace, as in "resource.action"',
      },
      {
        title: 'an invalid name',
        tree: { 'pro duct': { create: true } },
        options: undefined,
        message:
          'Invalid permission name "pro duct". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'a dotted name',
        tree: { product: { 'create.all': true } },
        options: undefined,
        message:
          'Invalid permission name "create.all". Only letters, digits, "_" and "-" are allowed',
      },
      {
        title: 'an invalid leaf',
        tree: { product: { create: false } },
        options: undefined,
        message:
          'Invalid definition for permission "product.create". Expected true, a description or a nested namespace',
      },
      {
        title: 'an alias of a defined path',
        tree: { product: { create: true, delete: true } },
        options: { aliases: { 'product.create': 'product.delete' } },
        message: 'Alias "product.create" collides with a defined permission or namespace',
      },
      {
        title: 'an alias of a defined namespace',
        tree: { product: { create: true }, item: { create: true } },
        options: { aliases: { product: 'item' } },
        message: 'Alias "product" collides with a defined permission or namespace',
      },
      {
        title: 'a malformed alias',
        tree: { product: { create: true } },
        options: { aliases: { 'product.*': 'product.create' } },
        message: 'Invalid alias "product.*". Aliases must be dot paths, as in "resource.action"',
      },
      {
        title: 'an alias targeting an unknown path',
        tree: { product: { create: true } },
        options: { aliases: { 'item.create': 'product.add' } },
        message:
          'Alias "item.create" targets "product.add", which is neither a defined permission nor a namespace',
      },
      {
        title: 'a single segment alias targeting a permission',
        tree: { article: { publish: true } },
        options: { aliases: { legacy: 'article.publish' } },
        message:
          'Alias "legacy" targets the permission "article.publish". Permission aliases need at least two segments, as in "resource.action"',
      },
      {
        title: 'an unknown inactive path',
        tree: { product: { create: true } },
        options: { inactive: ['product.delete'] },
        message: 'Inactive path "product.delete" is neither a defined permission nor a namespace',
      },
    ])
    .run(({ assert }, { tree, options, message }) => {
      const define = definePermissions as unknown as (tree: unknown, options?: unknown) => unknown

      assert.throws(() => define(tree, options), message)

      try {
        define(tree, options)
      } catch (error) {
        assert.instanceOf(error, E_INVALID_PERMISSION_DEFINITION)
        assert.equal((error as { code: string }).code, 'E_INVALID_PERMISSION_DEFINITION')
      }
    })
})
