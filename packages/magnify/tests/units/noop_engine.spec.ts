import { SimplePaginator } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import { SearchBuilder } from '../../src/builder.js'
import { NoopEngine } from '../../src/engines/noop.js'
import { SearchableModel } from '../fixtures/searchable_model.js'

test.group('Noop engine', () => {
  test('update resolves without indexing', async ({ assert }) => {
    const engine = new NoopEngine()

    await assert.doesNotReject(() => engine.update(new SearchableModel('1')))
  })

  test('delete resolves without removing documents', async ({ assert }) => {
    const engine = new NoopEngine()

    await assert.doesNotReject(() => engine.delete(new SearchableModel('1')))
  })

  test('flush resolves without clearing an index', async ({ assert }) => {
    const engine = new NoopEngine()

    await assert.doesNotReject(() => engine.flush(SearchableModel))
  })

  test('search always returns an empty array', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, 'anything')

    assert.deepEqual(await engine.search(builder), [])
  })

  test('search ignores filters, orders and limits', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, 'lar')
      .where('isAdmin', true)
      .whereIn('id', ['1'])
      .whereNotIn('id', ['2'])
      .orderBy('createdAt', 'desc')
      .take(10)

    assert.deepEqual(await engine.search(builder), [])
  })

  test('map always returns an empty array', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, 'anything')

    assert.deepEqual(await engine.map(builder, [{ id: '1' }]), [])
    assert.deepEqual(await engine.map(builder, []), [])
  })

  test('get always returns an empty array', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, 'anything')

    assert.deepEqual(await engine.get(builder), [])
  })

  test('paginate returns an empty paginator', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, 'anything')

    const paginator = await engine.paginate(builder, 15, 2)

    assert.instanceOf(paginator, SimplePaginator)
    assert.equal(paginator.total, 0)
    assert.equal(paginator.perPage, 15)
    assert.equal(paginator.currentPage, 2)
    assert.isTrue(paginator.isEmpty)
    assert.deepEqual(paginator.all(), [])
  })

  test('paginate uses the requested page and perPage', async ({ assert }) => {
    const engine = new NoopEngine()
    const builder = new SearchBuilder(SearchableModel, '')

    const first = await engine.paginate(builder, 5, 1)
    const second = await engine.paginate(builder, 25, 3)

    assert.equal(first.perPage, 5)
    assert.equal(first.currentPage, 1)
    assert.equal(second.perPage, 25)
    assert.equal(second.currentPage, 3)
  })
})
