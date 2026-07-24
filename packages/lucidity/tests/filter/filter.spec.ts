import { test } from '@japa/runner'
import { type ApplicationService } from '@adonisjs/core/types'
import { type Database } from '@adonisjs/lucid/database'
import { setupDatabase } from '../helpers.ts'
import { setupSchema } from './schema.ts'
import { User } from './models.ts'
import type { FilterScopeParams } from '../../modules/filter/types.ts'

test.group('Filter', (group) => {
  let db: Database
  let app: ApplicationService

  group.setup(async () => {
    const result = await setupDatabase({
      client: 'sqlite',
      connection: { filename: ':memory:' },
    })

    app = result.app
    db = result.db

    return setupSchema(db)
  })

  group.teardown(async () => {
    await app.terminate()
  })

  group.each.setup(async () => {
    await db.connection().truncateAllTables()
    await seed()
  })

  /**
   * Four users, one with a null last name and varied ages. Alice and Bob
   * each own a post so relation filtering has something to match.
   */
  async function seed() {
    const [alice, bob] = await User.createMany([
      { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', age: 30 },
      { firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com', age: 25 },
      { firstName: 'Carol', lastName: 'Smith', email: 'carol@example.com', age: 40 },
      { firstName: 'Dave', lastName: null, email: 'dave@example.com', age: 20 },
    ])

    await alice.related('posts').create({ title: 'TypeScript rocks', published: true })
    await bob.related('posts').create({ title: 'Hello world', published: false })
  }

  /**
   * Apply a filter and return the matched first names. A stable `id` order
   * is forced so non-sort assertions stay deterministic.
   */
  async function names(params: FilterScopeParams) {
    const users = await User.query()
      .withScopes((scopes) => scopes.filter(params))
      .orderBy('id')
    return users.map((user) => user.firstName)
  }

  /**
   * ---------------------------------------------------------------------------
   * Operators
   * ---------------------------------------------------------------------------
   */

  test('$eq matches an exact value', async ({ expect }) => {
    expect(await names({ filter: { firstName: { $eq: 'Alice' } } })).toEqual(['Alice'])
  })

  test('a bare value is treated as $eq', async ({ expect }) => {
    expect(await names({ filter: { firstName: 'Bob' } })).toEqual(['Bob'])
  })

  test('$ne excludes a value', async ({ expect }) => {
    expect(await names({ filter: { firstName: { $ne: 'Alice' } } })).toEqual([
      'Bob',
      'Carol',
      'Dave',
    ])
  })

  test('$gt / $gte / $lt / $lte compare numbers', async ({ expect }) => {
    expect(await names({ filter: { age: { $gte: 30 } } })).toEqual(['Alice', 'Carol'])
    expect(await names({ filter: { age: { $gt: 30 } } })).toEqual(['Carol'])
    expect(await names({ filter: { age: { $lt: 25 } } })).toEqual(['Dave'])
    expect(await names({ filter: { age: { $lte: 25 } } })).toEqual(['Bob', 'Dave'])
  })

  test('multiple operators on one field combine with AND', async ({ expect }) => {
    expect(await names({ filter: { age: { $gte: 25, $lte: 30 } } })).toEqual(['Alice', 'Bob'])
  })

  test('$in / $notIn match a set', async ({ expect }) => {
    expect(await names({ filter: { firstName: { $in: ['Alice', 'Dave'] } } })).toEqual([
      'Alice',
      'Dave',
    ])
    expect(await names({ filter: { firstName: { $notIn: ['Alice', 'Dave'] } } })).toEqual([
      'Bob',
      'Carol',
    ])
  })

  test('$contains / $startsWith / $endsWith match substrings', async ({ expect }) => {
    expect(await names({ filter: { email: { $contains: 'example' } } })).toEqual([
      'Alice',
      'Carol',
      'Dave',
    ])
    expect(await names({ filter: { lastName: { $startsWith: 'Sm' } } })).toEqual(['Alice', 'Carol'])
    expect(await names({ filter: { email: { $endsWith: 'test.com' } } })).toEqual(['Bob'])
  })

  test('$between matches an inclusive range', async ({ expect }) => {
    expect(await names({ filter: { age: { $between: [25, 30] } } })).toEqual(['Alice', 'Bob'])
  })

  test('$null toggles null / not null', async ({ expect }) => {
    expect(await names({ filter: { lastName: { $null: true } } })).toEqual(['Dave'])
    expect(await names({ filter: { lastName: { $null: false } } })).toEqual([
      'Alice',
      'Bob',
      'Carol',
    ])
  })

  /**
   * ---------------------------------------------------------------------------
   * Boolean groups
   * ---------------------------------------------------------------------------
   */

  test('$and combines groups', async ({ expect }) => {
    expect(
      await names({ filter: { $and: [{ lastName: 'Smith' }, { age: { $gte: 35 } }] } })
    ).toEqual(['Carol'])
  })

  test('$or matches any group', async ({ expect }) => {
    expect(
      await names({ filter: { $or: [{ firstName: 'Alice' }, { firstName: 'Bob' }] } })
    ).toEqual(['Alice', 'Bob'])
  })

  test('$or is grouped and AND-ed with sibling fields', async ({ expect }) => {
    // lastName = Smith AND (age <= 30 OR age >= 40) -> Alice, Carol (not Bob)
    expect(
      await names({
        filter: {
          lastName: 'Smith',
          $or: [{ age: { $lte: 30 } }, { age: { $gte: 40 } }],
        },
      })
    ).toEqual(['Alice', 'Carol'])
  })

  /**
   * ---------------------------------------------------------------------------
   * Allowlist
   * ---------------------------------------------------------------------------
   */

  test('a non-filterable field is ignored', async ({ expect }) => {
    expect(await names({ filter: { createdAt: { $gte: '2000-01-01' } } })).toEqual([
      'Alice',
      'Bob',
      'Carol',
      'Dave',
    ])
  })

  test('a non-sortable column is ignored', async ({ expect }) => {
    // `email` is not in the sortable allowlist, so insertion (id) order stands.
    const users = await User.query().withScopes((scopes) =>
      scopes.filter({ sort: { email: 'desc' } })
    )
    expect(users.map((u) => u.firstName)).toEqual(['Alice', 'Bob', 'Carol', 'Dave'])
  })

  /**
   * ---------------------------------------------------------------------------
   * Sorting
   * ---------------------------------------------------------------------------
   */

  test('sort ascending / descending', async ({ expect }) => {
    const asc = await User.query().withScopes((scopes) => scopes.filter({ sort: { age: 'asc' } }))
    expect(asc.map((u) => u.firstName)).toEqual(['Dave', 'Bob', 'Alice', 'Carol'])

    const desc = await User.query().withScopes((scopes) => scopes.filter({ sort: { age: 'desc' } }))
    expect(desc.map((u) => u.firstName)).toEqual(['Carol', 'Alice', 'Bob', 'Dave'])
  })

  test('filter and sort combine', async ({ expect }) => {
    const users = await User.query().withScopes((scopes) =>
      scopes.filter({ filter: { age: { $gte: 25 } }, sort: { age: 'desc' } })
    )
    expect(users.map((u) => u.firstName)).toEqual(['Carol', 'Alice', 'Bob'])
  })

  /**
   * ---------------------------------------------------------------------------
   * Relations
   * ---------------------------------------------------------------------------
   */

  test('relation filter constrains via whereHas', async ({ expect }) => {
    expect(await names({ filter: { posts: { title: { $contains: 'Type' } } } })).toEqual(['Alice'])
    expect(await names({ filter: { posts: { title: { $contains: 'world' } } } })).toEqual(['Bob'])
  })

  test('relation filter applies the related allowlist', async ({ expect }) => {
    expect(await names({ filter: { posts: { published: true } } })).toEqual(['Alice'])
  })

  test('relation filter ignores a non-filterable related column', async ({ expect }) => {
    // `userId` is not in Post's filterable list, so the relation only checks existence.
    expect(await names({ filter: { posts: { userId: { $eq: 999 } } } })).toEqual(['Alice', 'Bob'])
  })

  /**
   * ---------------------------------------------------------------------------
   * Search
   * ---------------------------------------------------------------------------
   */

  test('search matches across the configured columns', async ({ expect }) => {
    // `User.search` scans firstName and lastName.
    expect(await names({ search: 'ali' })).toEqual(['Alice'])
    expect(await names({ search: 'smith' })).toEqual(['Alice', 'Carol'])
  })

  test('search combines with filters using AND', async ({ expect }) => {
    // search hits Alice + Carol (lastName Smith), the age filter keeps only Alice.
    // A leaking OR would also pull in Bob and Dave, so this pins the wrapping.
    expect(await names({ search: 'smith', filter: { age: { $lte: 30 } } })).toEqual(['Alice'])
  })

  test('an empty search is a no-op', async ({ expect }) => {
    expect(await names({ search: '' })).toEqual(['Alice', 'Bob', 'Carol', 'Dave'])
  })
})
