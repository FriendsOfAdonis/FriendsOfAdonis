import { test } from '@japa/runner'
import { parseGrant } from '../src/grants.ts'
import { permissions } from './fixtures/models.ts'

test.group('Resolver', () => {
  test('resolves {grants} to {expected}')
    .with([
      { grants: [], expected: [] },
      { grants: ['product.create'], expected: ['product.create'] },
      {
        grants: ['billing.refund', 'product.create'],
        expected: ['product.create', 'billing.refund'],
      },
      { grants: ['product.create', 'product.create'], expected: ['product.create'] },
      { grants: ['product.remove'], expected: ['product.delete'] },
      { grants: ['product.remove', 'product.delete'], expected: ['product.delete'] },
      { grants: ['product.archive'], expected: [] },
      { grants: ['order.create'], expected: [] },
      { grants: ['not a grant', '', '**'], expected: [] },
      {
        grants: ['*'],
        expected: [
          'product.create',
          'product.update',
          'product.delete',
          'billing.refund',
          'admin:user.ban',
          'admin:user.impersonate',
        ],
      },
      {
        grants: ['product.*'],
        expected: ['product.create', 'product.update', 'product.delete'],
      },
      { grants: ['admin:*'], expected: ['admin:user.ban', 'admin:user.impersonate'] },
      { grants: ['admin:user.*'], expected: ['admin:user.ban', 'admin:user.impersonate'] },
      { grants: ['user.*'], expected: [] },
      { grants: ['admin:product.*'], expected: [] },
      { grants: ['staff:*'], expected: [] },
      { grants: ['order.*'], expected: [] },
      {
        grants: ['billing.*', 'admin:user.ban'],
        expected: ['billing.refund', 'admin:user.ban'],
      },
    ])
    .run(({ assert }, { grants, expected }) => {
      assert.deepEqual(permissions.resolve(grants), expected)
    })

  test('accepts any iterable', ({ assert }) => {
    assert.deepEqual(permissions.resolve(new Set(['billing.refund', 'product.remove'])), [
      'product.delete',
      'billing.refund',
    ])
  })

  test('ignores non string values coming from untyped storage', ({ assert }) => {
    assert.deepEqual(permissions.resolve([42, null, 'billing.refund'] as unknown as string[]), [
      'billing.refund',
    ])
  })

  test('parses {value}')
    .with([
      { value: '*', expected: { kind: 'all' } },
      { value: 'admin:*', expected: { kind: 'prefix', prefix: 'admin' } },
      {
        value: 'product.*',
        expected: { kind: 'resource', prefix: undefined, resource: 'product' },
      },
      {
        value: 'admin:user.*',
        expected: { kind: 'resource', prefix: 'admin', resource: 'user' },
      },
      { value: 'product.create', expected: { kind: 'key', key: 'product.create' } },
      { value: 'admin:user.ban', expected: { kind: 'key', key: 'admin:user.ban' } },
      { value: 'product', expected: null },
      { value: '*.create', expected: null },
      { value: 'a:b:c.d', expected: null },
    ])
    .run(({ assert }, { value, expected }) => {
      assert.deepEqual(parseGrant(value), expected)
    })
})
