import { SimplePaginator } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import sinon from 'sinon'
import { SearchBuilder } from '../../src/builder.js'
import { LucidEngine } from '../../src/engines/lucid.js'
import { SearchableModel } from '../fixtures/searchable_model.js'

function createQueryStub(rows: unknown[] = [], dialect = 'sqlite3') {
  const group = {
    orWhereLike: sinon.stub(),
    orWhereILike: sinon.stub(),
  }
  group.orWhereLike.returns(group)
  group.orWhereILike.returns(group)

  const query: Record<string, any> = {
    group,
    client: {
      dialect: {
        name: dialect,
      },
    },
    limit: sinon.stub(),
    where: sinon.stub(),
    whereIn: sinon.stub(),
    whereNotIn: sinon.stub(),
    orderBy: sinon.stub(),
    exec: sinon.stub().resolves(rows),
    paginate: sinon.stub().resolves({
      total: rows.length,
      all: () => rows,
    }),
  }

  query.limit.returns(query)
  query.where.callsFake((...args: unknown[]) => {
    if (typeof args[0] === 'function') {
      ;(args[0] as (value: typeof group) => void)(group)
    }
    return query
  })
  query.whereIn.returns(query)
  query.whereNotIn.returns(query)
  query.orderBy.returns(query)

  return query
}

function createModel(
  query: ReturnType<typeof createQueryStub>,
  options: { searchableColumns?: string[]; columns?: Record<string, string> } = {}
) {
  const { searchableColumns = ['name'], columns = {} } = options

  return {
    $searchableColumns: searchableColumns,
    $keys: {
      attributesToColumns: {
        get(field: string, fallback: string) {
          return columns[field] ?? fallback
        },
      },
    },
    query: () => query,
  }
}

test.group('Lucid engine', (group) => {
  let engine: LucidEngine

  group.each.setup(() => {
    engine = new LucidEngine()
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('update is a no-op', async ({ assert }) => {
    await assert.doesNotReject(() => engine.update(new SearchableModel('1')))
  })

  test('delete is a no-op', async ({ assert }) => {
    await assert.doesNotReject(() => engine.delete(new SearchableModel('1')))
  })

  test('flush is a no-op', async ({ assert }) => {
    await assert.doesNotReject(() => engine.flush(SearchableModel))
  })

  test('search applies like constraints on searchable columns', async ({ assert }) => {
    const query = createQueryStub([{ id: '1' }])
    const builder = new SearchBuilder(createModel(query) as any, 'Lar')

    const results = await engine.search(builder)

    assert.isTrue(query.where.calledOnce)
    assert.isTrue(query.group.orWhereLike.calledWith('name', '%Lar%'))
    assert.isFalse(query.group.orWhereILike.called)
    assert.isTrue(query.exec.calledOnce)
    assert.isFalse(query.limit.called)
    assert.deepEqual(results, [{ id: '1' }])
  })

  test('search matches against every searchable column', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(
      createModel(query, { searchableColumns: ['name', 'email'] }) as any,
      'foo'
    )

    await engine.search(builder)

    assert.equal(query.group.orWhereLike.callCount, 2)
    assert.isTrue(query.group.orWhereLike.calledWith('name', '%foo%'))
    assert.isTrue(query.group.orWhereLike.calledWith('email', '%foo%'))
    assert.isFalse(query.group.orWhereILike.called)
  })

  test('search skips text constraints when the query is empty', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(createModel(query) as any, '')

    await engine.search(builder)

    assert.isFalse(query.where.called)
    assert.isFalse(query.group.orWhereLike.called)
    assert.isFalse(query.group.orWhereILike.called)
    assert.isTrue(query.exec.calledOnce)
  })

  test('search skips like clauses when there are no searchable columns', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(
      createModel(query, { searchableColumns: [] }) as any,
      'lar'
    )

    await engine.search(builder)

    assert.isTrue(query.where.calledOnce)
    assert.isFalse(query.group.orWhereLike.called)
    assert.isFalse(query.group.orWhereILike.called)
  })

  test('search treats missing searchable columns as an empty list', async ({ assert }) => {
    const query = createQueryStub()
    const model = createModel(query)
    delete (model as { $searchableColumns?: string[] }).$searchableColumns
    const builder = new SearchBuilder(model as any, 'lar')

    await engine.search(builder)

    assert.isTrue(query.where.calledOnce)
    assert.isFalse(query.group.orWhereLike.called)
    assert.isFalse(query.group.orWhereILike.called)
  })

  test('search applies a limit when take is set', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(createModel(query) as any, 'lar').take(5)

    await engine.search(builder)

    assert.isTrue(query.limit.calledOnceWithExactly(5))
  })

  test('search applies where, whereIn and whereNotIn filters', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(createModel(query) as any, '')
      .where('isAdmin', true)
      .whereIn('id', ['1', '2'])
      .whereNotIn('name', ['Example 2'])

    await engine.search(builder)

    assert.isTrue(query.where.calledWith('isAdmin', true))
    assert.isTrue(query.whereIn.calledOnceWithExactly('id', ['1', '2']))
    assert.isTrue(query.whereNotIn.calledOnceWithExactly('name', ['Example 2']))
  })

  test('search applies order clauses', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(createModel(query) as any, '')
      .orderBy('createdAt', 'desc')
      .orderBy('name', 'asc')

    await engine.search(builder)

    assert.isTrue(query.orderBy.calledWith('createdAt', 'desc'))
    assert.isTrue(query.orderBy.calledWith('name', 'asc'))
    assert.equal(query.orderBy.callCount, 2)
  })

  test('search maps attribute names to columns', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(
      createModel(query, {
        columns: {
          name: 'full_name',
          isAdmin: 'is_admin',
          createdAt: 'created_at',
        },
      }) as any,
      'lar'
    )
      .where('isAdmin', true)
      .whereIn('name', ['Larry'])
      .whereNotIn('isAdmin', [false])
      .orderBy('createdAt', 'desc')

    await engine.search(builder)

    assert.isTrue(query.group.orWhereLike.calledWith('full_name', '%lar%'))
    assert.isFalse(query.group.orWhereILike.called)
    assert.isTrue(query.where.calledWith('is_admin', true))
    assert.isTrue(query.whereIn.calledWith('full_name', ['Larry']))
    assert.isTrue(query.whereNotIn.calledWith('is_admin', [false]))
    assert.isTrue(query.orderBy.calledWith('created_at', 'desc'))
  })

  test('search uses orWhereLike for mysql dialect', async ({ assert }) => {
    const query = createQueryStub([], 'mysql')
    const builder = new SearchBuilder(createModel(query) as any, 'lar')

    await engine.search(builder)

    assert.isTrue(query.group.orWhereLike.calledWith('name', '%lar%'))
    assert.isFalse(query.group.orWhereILike.called)
  })

  test('map returns the results as-is', async ({ assert }) => {
    const rows = [{ id: '1' }, { id: '2' }]
    const builder = new SearchBuilder(createModel(createQueryStub()) as any, 'lar')

    assert.deepEqual(await engine.map(builder, rows as any), rows)
  })

  test('get maps search results without extra transformation', async ({ assert }) => {
    const rows = [{ id: '1' }]
    const query = createQueryStub(rows)
    const builder = new SearchBuilder(createModel(query) as any, 'lar')

    assert.deepEqual(await engine.get(builder), rows)
  })

  test('paginate wraps the lucid paginator', async ({ assert }) => {
    const rows = [{ id: '1' }, { id: '2' }]
    const query = createQueryStub(rows)
    const builder = new SearchBuilder(createModel(query) as any, 'lar').take(10)

    const paginator = await engine.paginate(builder, 2, 1)

    assert.isTrue(query.paginate.calledOnceWithExactly(1, 2))
    assert.isFalse(query.limit.called)
    assert.instanceOf(paginator, SimplePaginator)
    assert.equal(paginator.total, 2)
    assert.equal(paginator.perPage, 2)
    assert.equal(paginator.currentPage, 1)
    assert.deepEqual(paginator.all(), rows)
  })

  test('paginate forwards filters and orders to the query', async ({ assert }) => {
    const query = createQueryStub()
    const builder = new SearchBuilder(createModel(query) as any, 'lar')
      .where('isAdmin', true)
      .orderBy('name', 'asc')

    await engine.paginate(builder, 5, 2)

    assert.isTrue(query.group.orWhereLike.calledWith('name', '%lar%'))
    assert.isFalse(query.group.orWhereILike.called)
    assert.isTrue(query.where.calledWith('isAdmin', true))
    assert.isTrue(query.orderBy.calledWith('name', 'asc'))
    assert.isTrue(query.paginate.calledOnceWithExactly(2, 5))
  })
})

test.group('Lucid engine (postgres dialect)', (group) => {
  let engine: LucidEngine

  group.each.setup(() => {
    engine = new LucidEngine()
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('search applies case-insensitive like constraints on searchable columns', async ({
    assert,
  }) => {
    const query = createQueryStub([{ id: '1' }], 'postgres')
    const builder = new SearchBuilder(createModel(query) as any, 'Lar')

    const results = await engine.search(builder)

    assert.isTrue(query.where.calledOnce)
    assert.isTrue(query.group.orWhereILike.calledWith('name', '%Lar%'))
    assert.isFalse(query.group.orWhereLike.called)
    assert.isTrue(query.exec.calledOnce)
    assert.deepEqual(results, [{ id: '1' }])
  })

  test('search matches against every searchable column with orWhereILike', async ({
    assert,
  }) => {
    const query = createQueryStub([], 'postgres')
    const builder = new SearchBuilder(
      createModel(query, { searchableColumns: ['name', 'email'] }) as any,
      'foo'
    )

    await engine.search(builder)

    assert.equal(query.group.orWhereILike.callCount, 2)
    assert.isTrue(query.group.orWhereILike.calledWith('name', '%foo%'))
    assert.isTrue(query.group.orWhereILike.calledWith('email', '%foo%'))
    assert.isFalse(query.group.orWhereLike.called)
  })

  test('search maps attribute names to columns with orWhereILike', async ({ assert }) => {
    const query = createQueryStub([], 'postgres')
    const builder = new SearchBuilder(
      createModel(query, {
        columns: {
          name: 'full_name',
          isAdmin: 'is_admin',
        },
      }) as any,
      'lar'
    ).where('isAdmin', true)

    await engine.search(builder)

    assert.isTrue(query.group.orWhereILike.calledWith('full_name', '%lar%'))
    assert.isFalse(query.group.orWhereLike.called)
    assert.isTrue(query.where.calledWith('is_admin', true))
  })

  test('paginate uses orWhereILike for text constraints', async ({ assert }) => {
    const query = createQueryStub([], 'postgres')
    const builder = new SearchBuilder(createModel(query) as any, 'lar').orderBy('name', 'asc')

    await engine.paginate(builder, 5, 2)

    assert.isTrue(query.group.orWhereILike.calledWith('name', '%lar%'))
    assert.isFalse(query.group.orWhereLike.called)
    assert.isTrue(query.orderBy.calledWith('name', 'asc'))
    assert.isTrue(query.paginate.calledOnceWithExactly(2, 5))
  })

  test('search skips text constraints when the query is empty', async ({ assert }) => {
    const query = createQueryStub([], 'postgres')
    const builder = new SearchBuilder(createModel(query) as any, '')

    await engine.search(builder)

    assert.isFalse(query.where.called)
    assert.isFalse(query.group.orWhereILike.called)
    assert.isFalse(query.group.orWhereLike.called)
  })
})
