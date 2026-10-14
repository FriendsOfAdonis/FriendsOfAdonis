import { test } from '@japa/runner'
import { Access } from '../src/access.ts'
import { permissions } from './fixtures/models.ts'

test.group('Access', () => {
  test('allows and denies resolved keys', ({ assert }) => {
    const access = permissions.access(['product.create', 'product.remove', 'product.archive'])

    assert.instanceOf(access, Access)
    assert.isTrue(access.allows('product.create'))
    assert.isTrue(access.allows('product.delete'))
    assert.isFalse(access.allows('billing.refund'))
    assert.isTrue(access.denies('billing.refund'))
    assert.isFalse(access.denies('product.create'))
    assert.deepEqual(access.permissions(), ['product.create', 'product.delete'])
  })

  test('checks several keys with allowsAll and allowsAny', ({ assert }) => {
    const access = permissions.access(['product.create', 'billing.refund'])

    assert.isTrue(access.allowsAll(['product.create', 'billing.refund']))
    assert.isFalse(access.allowsAll(['product.create', 'product.update']))
    assert.isTrue(access.allowsAll([]))

    assert.isTrue(access.allowsAny(['product.update', 'billing.refund']))
    assert.isFalse(access.allowsAny(['product.update', 'admin:user.ban']))
    assert.isFalse(access.allowsAny([]))
  })

  test('scopes to the intersection with explicit keys', ({ assert }) => {
    const access = permissions.access(['product.*', 'billing.refund'])
    const scoped = access.scope(['product.create', 'product.update', 'admin:user.ban'])

    assert.deepEqual(scoped.permissions(), ['product.create', 'product.update'])
    assert.isFalse(scoped.allows('billing.refund'))
    assert.isFalse(scoped.allows('admin:user.ban'))
  })

  test('keeps everything with a ["*"] scope', ({ assert }) => {
    const access = permissions.access(['product.create', 'admin:*'])

    assert.deepEqual(access.scope(['*']).permissions(), [
      'product.create',
      'admin:user.ban',
      'admin:user.impersonate',
    ])
  })

  test('resolves wildcards and aliases in the scope', ({ assert }) => {
    const access = permissions.access(['*'])

    assert.deepEqual(access.scope(['product.*']).permissions(), [
      'product.create',
      'product.update',
      'product.delete',
    ])
    assert.deepEqual(access.scope(['product.remove', 'product.archive']).permissions(), [
      'product.delete',
    ])
    assert.deepEqual(access.scope([]).permissions(), [])
  })

  test('is immutable', ({ assert }) => {
    const access = permissions.access(['product.create', 'billing.refund'])
    const scoped = access.scope(['billing.refund'])

    assert.notStrictEqual(scoped, access)
    assert.deepEqual(access.permissions(), ['product.create', 'billing.refund'])
    assert.deepEqual(scoped.permissions(), ['billing.refund'])

    const list = access.permissions()
    list.push('admin:user.ban')
    assert.isFalse(access.allows('admin:user.ban'))

    assert.isTrue(Object.isFrozen(access))
    assert.throws(() => {
      ;(access as unknown as { allows: unknown }).allows = () => true
    })
    assert.isFalse(access.allows('admin:user.ban'))
  })

  test('serializes to the list of keys', ({ assert }) => {
    const access = permissions.access(['billing.refund', 'product.create'])
    assert.equal(JSON.stringify({ access }), '{"access":["product.create","billing.refund"]}')
    assert.deepEqual(access.toJSON(), ['product.create', 'billing.refund'])
  })

  test('creates an access from a holder', async ({ assert }) => {
    const holder = { getGrants: async () => ['billing.*', 'product.remove'] }
    const access = await permissions.accessFor(holder)

    assert.deepEqual(access.permissions(), ['product.delete', 'billing.refund'])
  })
})
