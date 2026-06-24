import { test } from '@japa/runner'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { type HasMany, type HasOne } from '@adonisjs/lucid/types/relations'
import { morphTo, type MorphTo } from '../../src/polymorphic/main.ts'
import { Comment, Image, Post, Tag, Video } from './models.ts'

/**
 * These tests assert the *types* produced by the polymorphic decorators. The
 * `expectTypeOf` calls are erased at runtime; their value comes from the type
 * checker, so this file failing `tsc` is the real signal.
 *
 * Checks that need a real query/relation expression live in inner functions that
 * are type-checked but never executed (no database access happens). Each test
 * references its helper through a trivial runtime assertion.
 */
test.group('Polymorphic types', () => {
  test('morph relation properties carry the right relation brand', ({ expectTypeOf }) => {
    expectTypeOf<Post['image']>().toEqualTypeOf<HasOne<typeof Image> | null>()
    expectTypeOf<Post['comments']>().toEqualTypeOf<HasMany<typeof Comment>>()
    expectTypeOf<Post['tags']>().toEqualTypeOf<HasMany<typeof Tag>>()
    expectTypeOf<Comment['commentable']>().toEqualTypeOf<
      MorphTo<[typeof Post, typeof Video]> | null
    >()
  })

  test('relation values resolve to the right model instance types', ({ expectTypeOf }) => {
    // morphMany behaves like an array of the related model.
    expectTypeOf<Post['comments']>().items.toEqualTypeOf<Comment>()
    // morphTo resolves to the union of its candidate models (or null).
    expectTypeOf<NonNullable<Comment['commentable']>>().toExtend<Post | Video>()
    expectTypeOf<NonNullable<Image['imageable']>>().toExtend<Post | Video>()
  })

  test('preload accepts morph relation names without casts', ({ expectTypeOf }) => {
    function _checks() {
      const postQuery = Post.query()
      const commentQuery = Comment.query()

      expectTypeOf(postQuery.preload).toBeCallableWith('image')
      expectTypeOf(postQuery.preload).toBeCallableWith('comments')
      expectTypeOf(postQuery.preload).toBeCallableWith('tags')
      expectTypeOf(commentQuery.preload).toBeCallableWith('commentable')

      // @ts-expect-error - 'title' is a column, not a relation, so preload rejects it
      postQuery.preload('title')
    }

    expectTypeOf(_checks).toBeFunction()
  })

  test('related() exposes the matching relation client surface', ({ expectTypeOf }) => {
    function _checks(comment: Comment, post: Post) {
      // morphTo -> belongsTo client: associate / dissociate
      expectTypeOf(comment.related('commentable').associate).toBeFunction()
      expectTypeOf(comment.related('commentable').dissociate).toBeFunction()
      // morphMany -> hasMany client: createMany / saveMany
      expectTypeOf(post.related('comments').createMany).toBeFunction()
      expectTypeOf(post.related('comments').saveMany).toBeFunction()
      // morphOne -> hasOne client: create / save
      expectTypeOf(post.related('image').create).toBeFunction()
    }

    expectTypeOf(_checks).toBeFunction()
  })

  test('the decorators reject wrongly typed properties', ({ expectTypeOf }) => {
    function _checks() {
      class Bad extends BaseModel {
        @column()
        declare commentableType: string | null

        @column()
        declare commentableId: number | null

        // @ts-expect-error - property must be MorphTo<[typeof Post, typeof Video]> | null
        @morphTo(() => [Post, Video])
        declare commentable: string

        // @ts-expect-error - morphTo requires a non-empty candidate list
        @morphTo(() => [])
        declare nothing: MorphTo<[typeof Post]> | null
      }

      return Bad
    }

    expectTypeOf(_checks).toBeFunction()
  })
})
