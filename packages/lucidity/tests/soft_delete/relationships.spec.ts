import { ApplicationService } from '@adonisjs/core/types'
import { Database } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import { setupDatabase } from '../helpers.ts'
import { BaseModel, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import type { HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { E_NOT_THROUGH_RELATION, SoftDeletable } from '../../modules/soft_delete/main.ts'

async function cleanSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.dropTableIfExists('comments')
  await connection.schema.dropTableIfExists('posts')
  await connection.schema.dropTableIfExists('users')
  await connection.schema.dropTableIfExists('countries')
}

async function setupSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.createTable('countries', (table) => {
    table.increments()
    table.string('name').notNullable()
  })

  await connection.schema.createTable('users', (table) => {
    table.increments()
    table.integer('country_id').nullable()
    table.integer('parent_id').nullable()
    table.string('name').notNullable()
    table.timestamp('deleted_at').nullable()
  })

  await connection.schema.createTable('posts', (table) => {
    table.increments()
    table.integer('user_id').notNullable()
    table.string('title').notNullable()
    table.timestamp('deleted_at').nullable()
  })

  await connection.schema.createTable('comments', (table) => {
    table.increments()
    table.integer('post_id').notNullable()
    table.string('body').notNullable()
    table.timestamp('deleted_at').nullable()
  })

  return () => cleanSchema(db)
}

class Comment extends compose(BaseModel, SoftDeletable) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare body: string
}

class Post extends compose(BaseModel, SoftDeletable) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>
}

class User extends compose(BaseModel, SoftDeletable) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare countryId: number | null

  @column()
  declare parentId: number | null

  @column()
  declare name: string

  @hasMany(() => User, { foreignKey: 'parentId' })
  declare children: HasMany<typeof User>
}

class Country extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasManyThrough([() => Post, () => User])
  declare posts: HasManyThrough<typeof Post>
}

test.group('SoftDelete | relationships', (group) => {
  let db: Database
  let app: ApplicationService

  group.setup(async () => {
    const result = await setupDatabase({
      client: 'sqlite',
      connection: {
        filename: ':memory:',
      },
    })

    app = result.app
    db = result.db

    return setupSchema(db)
  })

  group.teardown(async () => {
    await app.terminate()
  })

  group.each.setup(() => db.connection().truncateAllTables())

  /**
   * Creates a post along with one comment per given state.
   */
  async function createPost(title: string, comments: ('kept' | 'trashed')[]) {
    const post = await Post.create({ userId: 1, title })
    for (const state of comments) {
      await Comment.create({
        postId: post.id,
        body: `${title} ${state} comment`,
        deletedAt: state === 'trashed' ? DateTime.now() : null,
      })
    }
    return post
  }

  /**
   * Creates a country with a post written by a user and a post written by a
   * trashed user.
   */
  async function createCountry() {
    const country = await Country.create({ name: 'France' })
    const jane = await User.create({ name: 'Jane', countryId: country.id })
    const john = await User.create({
      name: 'John',
      countryId: country.id,
      deletedAt: DateTime.now(),
    })
    const janePost = await Post.create({ userId: jane.id, title: 'Jane post' })
    const johnPost = await Post.create({ userId: john.id, title: 'John post' })
    return { country, janePost, johnPost }
  }

  /**
   * Creates a country whose only post is written by a trashed user.
   */
  async function createLonelyCountry() {
    const country = await Country.create({ name: 'Lonely' })
    const john = await User.create({
      name: 'John',
      countryId: country.id,
      deletedAt: DateTime.now(),
    })
    await Post.create({ userId: john.id, title: 'John post' })
    return country
  }

  /**
   * Creates a parent with a child, and an orphan whose only child is trashed.
   */
  async function createFamily() {
    const parent = await User.create({ name: 'Parent' })
    const orphan = await User.create({ name: 'Orphan' })
    await User.create({ name: 'Child', parentId: parent.id })
    await User.create({ name: 'Trashed child', parentId: orphan.id, deletedAt: DateTime.now() })
    return { parent, orphan }
  }

  /**
   * ---------------------------------------------------------------------------
   * Relationship subqueries hide the trashed related rows
   * ---------------------------------------------------------------------------
   */

  test('has should ignore trashed related rows', async ({ expect }) => {
    const kept = await createPost('Kept', ['kept', 'trashed'])
    await createPost('Trashed', ['trashed'])

    const posts = await Post.query().has('comments')
    expect(posts.map((post) => post.id)).toEqual([kept.id])
  })

  test('has with a count should ignore trashed related rows', async ({ expect }) => {
    const kept = await createPost('Kept', ['kept', 'kept'])
    await createPost('Trashed', ['kept', 'trashed'])

    const posts = await Post.query().has('comments', '>=', 2)
    expect(posts.map((post) => post.id)).toEqual([kept.id])
  })

  test('doesntHave should treat trashed related rows as missing', async ({ expect }) => {
    await createPost('Kept', ['kept'])
    const trashed = await createPost('Trashed', ['trashed'])

    const posts = await Post.query().doesntHave('comments')
    expect(posts.map((post) => post.id)).toEqual([trashed.id])
  })

  test('whereHas should include trashed related rows when using withTrashed', async ({
    expect,
  }) => {
    const kept = await createPost('Kept', ['kept'])
    const trashed = await createPost('Trashed', ['trashed'])

    const posts = await Post.query()
      .whereHas('comments', (query) => query.withTrashed())
      .orderBy('id')
    expect(posts.map((post) => post.id)).toEqual([kept.id, trashed.id])
  })

  test('whereHas should match only trashed related rows when using onlyTrashed', async ({
    expect,
  }) => {
    await createPost('Kept', ['kept'])
    const trashed = await createPost('Trashed', ['trashed'])

    const posts = await Post.query().whereHas('comments', (query) => query.onlyTrashed())
    expect(posts.map((post) => post.id)).toEqual([trashed.id])
  })

  test('withTrashed on the parent query should not reach its subqueries', async ({ expect }) => {
    const kept = await createPost('Kept', ['kept'])
    await createPost('Trashed', ['trashed'])

    const posts = await Post.query().withTrashed().has('comments')
    expect(posts.map((post) => post.id)).toEqual([kept.id])
  })

  test('withCount should only count the non trashed related rows', async ({ expect }) => {
    await createPost('Post', ['kept', 'trashed', 'trashed'])

    const post = await Post.query().withCount('comments').firstOrFail()
    expect(Number(post.$extras.comments_count)).toBe(1)
  })

  test('withCount should count trashed related rows when using withTrashed', async ({ expect }) => {
    await createPost('Post', ['kept', 'trashed', 'trashed'])

    const post = await Post.query()
      .withCount('comments', (query) => query.withTrashed())
      .firstOrFail()
    expect(Number(post.$extras.comments_count)).toBe(3)
  })

  test('withCount should ignore trashed related rows in a pojo query', async ({ expect }) => {
    await createPost('Post', ['kept', 'trashed'])

    const [post] = await Post.query().withCount('comments').pojo<{ comments_count: number }>()
    expect(Number(post.comments_count)).toBe(1)
  })

  test('has should ignore trashed rows of a self relationship', async ({ expect }) => {
    const { parent } = await createFamily()

    const users = await User.query().has('children')
    expect(users.map((user) => user.id)).toEqual([parent.id])
  })

  test('whereHas should match trashed rows of a self relationship when using onlyTrashed', async ({
    expect,
  }) => {
    const { orphan } = await createFamily()

    const users = await User.query().whereHas('children', (query) => query.onlyTrashed())
    expect(users.map((user) => user.id)).toEqual([orphan.id])
  })

  /**
   * ---------------------------------------------------------------------------
   * Related queries and preloads hide the trashed related rows
   * ---------------------------------------------------------------------------
   */

  test('related query should ignore trashed related rows', async ({ expect }) => {
    const post = await createPost('Post', ['kept', 'trashed'])

    const comments = await post.related('comments').query()
    expect(comments).toHaveLength(1)
  })

  test('preload should ignore trashed related rows', async ({ expect }) => {
    await createPost('Post', ['kept', 'trashed'])

    const post = await Post.query().preload('comments').firstOrFail()
    expect(post.comments).toHaveLength(1)
  })

  test('preload with a group limit should ignore trashed related rows', async ({ expect }) => {
    await createPost('First', ['kept', 'trashed', 'kept', 'kept'])
    await createPost('Second', ['trashed', 'kept'])

    const posts = await Post.query()
      .preload('comments', (query) => query.groupLimit(2))
      .orderBy('id')
    expect(posts.map((post) => post.comments.length)).toEqual([2, 1])
    expect(posts.flatMap((post) => post.comments).every((comment) => !comment.isTrashed)).toBe(true)
  })

  /**
   * ---------------------------------------------------------------------------
   * Has many through hides the rows of trashed through rows
   * ---------------------------------------------------------------------------
   */

  test('related query should ignore rows reached through trashed rows', async ({ expect }) => {
    const { country, janePost } = await createCountry()

    const posts = await country.related('posts').query()
    expect(posts.map((post) => post.id)).toEqual([janePost.id])
  })

  test('preload should ignore rows reached through trashed rows', async ({ expect }) => {
    const { janePost } = await createCountry()

    const country = await Country.query().preload('posts').firstOrFail()
    expect(country.posts.map((post) => post.id)).toEqual([janePost.id])
  })

  test('has should ignore rows reached through trashed rows', async ({ expect }) => {
    await createCountry()
    await createLonelyCountry()

    const countries = await Country.query().has('posts')
    expect(countries.map((country) => country.name)).toEqual(['France'])
  })

  test('withCount should ignore rows reached through trashed rows', async ({ expect }) => {
    await createCountry()

    const country = await Country.query().withCount('posts').firstOrFail()
    expect(Number(country.$extras.posts_count)).toBe(1)
  })

  test('related query should include rows reached through trashed rows when using withTrashedParents', async ({
    expect,
  }) => {
    const { country, janePost, johnPost } = await createCountry()

    const posts = await country.related('posts').query().withTrashedParents().orderBy('id')
    expect(posts.map((post) => post.id)).toEqual([janePost.id, johnPost.id])
  })

  test('whereHas should include rows reached through trashed rows when using withTrashedParents', async ({
    expect,
  }) => {
    await Country.create({ name: 'Empty' })
    await createLonelyCountry()

    const countries = await Country.query().whereHas('posts', (query) => query.withTrashedParents())
    expect(countries.map((country) => country.name)).toEqual(['Lonely'])
  })

  test('preload should include rows reached through trashed rows when using withTrashedParents', async ({
    expect,
  }) => {
    const { janePost, johnPost } = await createCountry()

    const country = await Country.query()
      .preload('posts', (query) => query.withTrashedParents().orderBy('id'))
      .firstOrFail()
    expect(country.posts.map((post) => post.id)).toEqual([janePost.id, johnPost.id])
  })

  test('pagination total should include rows reached through trashed rows when using withTrashedParents', async ({
    expect,
  }) => {
    const { country } = await createCountry()

    const page = await country.related('posts').query().withTrashedParents().paginate(1, 1)
    expect(page.total).toBe(2)
  })

  test('withTrashedParents should throw outside of a has many through relationship', async ({
    expect,
  }) => {
    // @ts-expect-error: only has many through queries and subqueries type the method
    expect(() => Post.query().withTrashedParents()).toThrow(E_NOT_THROUGH_RELATION)
    expect(() => Post.query().whereHas('comments', (query) => query.withTrashedParents())).toThrow(
      E_NOT_THROUGH_RELATION
    )
  })
})
