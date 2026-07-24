import { test } from '@japa/runner'
import { type ApplicationService } from '@adonisjs/core/types'
import { type Database } from '@adonisjs/lucid/database'
import { setupDatabase } from '../helpers.ts'
import { setupSchema } from './schema.ts'
import { Comment, Image, Post, Video } from './models.ts'

test.group('Polymorphic', (group) => {
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

  group.each.setup(() => db.connection().truncateAllTables())

  /**
   * ---------------------------------------------------------------------------
   * morphOne
   * ---------------------------------------------------------------------------
   */

  test('morphOne: create stamps the morph type and id', async ({ expect }) => {
    const post = await Post.create({ title: 'Hello' })
    const image = await post.related('image').create({ url: 'a.jpg' })

    expect(image.imageableType).toBe('posts')
    expect(image.imageableId).toBe(post.id)
  })

  test('morphOne: preload resolves the related row or null', async ({ expect }) => {
    const post = await Post.create({ title: 'Hello' })
    await post.related('image').create({ url: 'a.jpg' })
    const empty = await Post.create({ title: 'Empty' })

    const loaded = await Post.query().where('id', post.id).preload('image').firstOrFail()
    expect(loaded.image).not.toBeNull()
    expect(loaded.image!.url).toBe('a.jpg')

    const loadedEmpty = await Post.query().where('id', empty.id).preload('image').firstOrFail()
    expect(loadedEmpty.image).toBeNull()
  })

  test('morphOne: preloading many is isolated by morph type', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const video = await Video.create({ title: 'Video' })
    await post.related('image').create({ url: 'post.jpg' })
    await video.related('image').create({ url: 'video.jpg' })

    // Same id (1) in both tables: the type column must keep them apart.
    const posts = await Post.query().preload('image')
    const videos = await Video.query().preload('image')

    expect(posts[0].image!.url).toBe('post.jpg')
    expect(videos[0].image!.url).toBe('video.jpg')
  })

  test('morphOne: save attaches an existing instance', async ({ expect }) => {
    const post = await Post.create({ title: 'Hello' })
    const image = new Image()
    image.url = 'a.jpg'

    await post.related('image').save(image)

    expect(image.imageableType).toBe('posts')
    expect(image.imageableId).toBe(post.id)
  })

  test('morphOne: firstOrCreate and updateOrCreate keep the morph scope', async ({ expect }) => {
    const post = await Post.create({ title: 'Hello' })

    const first = await post.related('image').firstOrCreate({}, { url: 'a.jpg' })
    expect(first.imageableType).toBe('posts')

    const second = await post.related('image').firstOrCreate({}, { url: 'b.jpg' })
    expect(second.id).toBe(first.id)

    const updated = await post
      .related('image')
      .updateOrCreate({ id: first.id }, { url: 'c.jpg' })
    expect(updated.url).toBe('c.jpg')
    expect(await Image.query().count('* as total')).toHaveLength(1)
  })

  /**
   * ---------------------------------------------------------------------------
   * morphMany
   * ---------------------------------------------------------------------------
   */

  test('morphMany: createMany stamps every row', async ({ expect }) => {
    const post = await Post.create({ title: 'Hello' })
    const comments = await post
      .related('comments')
      .createMany([{ body: 'one' }, { body: 'two' }])

    expect(comments).toHaveLength(2)
    for (const comment of comments) {
      expect(comment.commentableType).toBe('posts')
      expect(comment.commentableId).toBe(post.id)
    }
  })

  test('morphMany: preload returns only this parent rows', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const video = await Video.create({ title: 'Video' })
    await post.related('comments').createMany([{ body: 'p1' }, { body: 'p2' }])
    await video.related('comments').createMany([{ body: 'v1' }])

    const loadedPost = await Post.query().where('id', post.id).preload('comments').firstOrFail()
    const loadedVideo = await Video.query().where('id', video.id).preload('comments').firstOrFail()

    expect(loadedPost.comments.map((c) => c.body).sort()).toEqual(['p1', 'p2'])
    expect(loadedVideo.comments.map((c) => c.body)).toEqual(['v1'])
  })

  test('morphMany: related query accepts extra constraints', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    await post.related('comments').createMany([{ body: 'a' }, { body: 'b' }, { body: 'c' }])

    const rows = await post.related('comments').query().orderBy('body', 'desc').limit(2)
    expect(rows.map((c) => c.body)).toEqual(['c', 'b'])

    const total = await post.related('comments').query().count('* as total')
    expect(Number(total[0].$extras.total)).toBe(3)
  })

  test('morphMany: saveMany attaches existing instances', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const c1 = new Comment()
    c1.body = 'a'
    const c2 = new Comment()
    c2.body = 'b'

    await post.related('comments').saveMany([c1, c2])

    expect(c1.commentableId).toBe(post.id)
    expect(c2.commentableType).toBe('posts')
  })

  test('morphMany: explicit name works without an inverse morphTo', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    await post.related('tags').createMany([{ name: 'red' }, { name: 'blue' }])

    const loaded = await Post.query().where('id', post.id).preload('tags').firstOrFail()
    expect(loaded.tags.map((t) => t.name).sort()).toEqual(['blue', 'red'])
    expect(loaded.tags[0].taggableType).toBe('posts')
  })

  /**
   * ---------------------------------------------------------------------------
   * morphTo
   * ---------------------------------------------------------------------------
   */

  test('morphTo: preload resolves the correct concrete model', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const comment = await post.related('comments').create({ body: 'hi' })

    const loaded = await Comment.query().where('id', comment.id).preload('commentable').firstOrFail()
    expect(loaded.commentable).toBeInstanceOf(Post)
    expect((loaded.commentable as Post).title).toBe('Post')
  })

  test('morphTo: preloads mixed parent types in one pass', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const video = await Video.create({ title: 'Video' })
    await post.related('comments').create({ body: 'on post' })
    await video.related('comments').create({ body: 'on video' })

    const comments = await Comment.query().preload('commentable').orderBy('id')

    expect(comments[0].commentable).toBeInstanceOf(Post)
    expect(comments[1].commentable).toBeInstanceOf(Video)
    expect((comments[1].commentable as Video).title).toBe('Video')
  })

  test('morphTo: uses the static morphType alias of the parent', async ({ expect }) => {
    const video = await Video.create({ title: 'Video' })
    const comment = await video.related('comments').create({ body: 'hi' })

    // Video declares `static morphType = 'video'`, not the table name `videos`.
    expect(comment.commentableType).toBe('video')

    const loaded = await Comment.query().where('id', comment.id).preload('commentable').firstOrFail()
    expect(loaded.commentable).toBeInstanceOf(Video)
  })

  test('morphTo: resolves to null when the morph columns are empty', async ({ expect }) => {
    const comment = await Comment.create({ body: 'orphan' })

    const loaded = await Comment.query().where('id', comment.id).preload('commentable').firstOrFail()
    expect(loaded.commentable).toBeNull()
  })

  test('morphTo: related query targets the resolved parent', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const comment = await post.related('comments').create({ body: 'hi' })

    const parent = await comment.related('commentable').query().firstOrFail()
    expect(parent).toBeInstanceOf(Post)
    expect(parent.id).toBe(post.id)
  })

  test('morphTo: associate sets the columns and persists', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const comment = await Comment.create({ body: 'hi' })

    await comment.related('commentable').associate(post)

    expect(comment.commentableType).toBe('posts')
    expect(comment.commentableId).toBe(post.id)
    expect(comment.commentable).toBeInstanceOf(Post)

    const fresh = await Comment.findOrFail(comment.id)
    expect(fresh.commentableId).toBe(post.id)
  })

  test('morphTo: dissociate clears the columns', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const comment = await post.related('comments').create({ body: 'hi' })

    await comment.related('commentable').dissociate()

    expect(comment.commentableType).toBeNull()
    expect(comment.commentableId).toBeNull()

    const fresh = await Comment.findOrFail(comment.id)
    expect(fresh.commentableType).toBeNull()
  })

  test('morphTo: supports nested preloads on each resolved type', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    await post.related('comments').create({ body: 'root' })
    await post.related('tags').create({ name: 'red' })

    // Preload the comment's commentable (Post), then the Post's tags.
    const comment = await Comment.query()
      .preload('commentable', (parent) => parent.preload('tags' as never))
      .firstOrFail()

    const parent = comment.commentable as Post
    expect(parent).toBeInstanceOf(Post)
    expect(parent.tags.map((t) => t.name)).toEqual(['red'])
  })

  test('morphTo: preload with a narrowed select still resolves the parent', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    const comment = await post.related('comments').create({ body: 'hi' })

    // The callback narrows the columns; the primary key must still be selected
    // so the row can be matched back to its parent.
    const loaded = await Comment.query()
      .where('id', comment.id)
      .preload('commentable', (q) => q.select('title' as never))
      .firstOrFail()

    expect(loaded.commentable).toBeInstanceOf(Post)
    expect((loaded.commentable as Post).title).toBe('Post')
  })

  test('morphTo: nested preload is skipped for candidate types lacking the relation', async ({
    expect,
  }) => {
    const post = await Post.create({ title: 'Post' })
    const video = await Video.create({ title: 'Video' })
    await post.related('comments').create({ body: 'on post' })
    await video.related('comments').create({ body: 'on video' })
    await post.related('tags').create({ name: 'red' })

    // `tags` exists on Post but not Video. The Video branch must not throw.
    const comments = await Comment.query()
      .preload('commentable', (parent) => parent.preload('tags' as never))
      .orderBy('id')

    const postParent = comments[0].commentable as Post
    expect(postParent).toBeInstanceOf(Post)
    expect(postParent.tags.map((t) => t.name)).toEqual(['red'])
    expect(comments[1].commentable).toBeInstanceOf(Video)
  })

  test('morphTo: associate persists an unsaved parent before linking', async ({ expect }) => {
    const post = new Post()
    post.title = 'Fresh'
    const comment = await Comment.create({ body: 'hi' })

    await comment.related('commentable').associate(post)

    expect(post.$isPersisted).toBe(true)
    expect(comment.commentableType).toBe('posts')
    expect(comment.commentableId).toBe(post.id)
  })

  test('lazy load via model.load() works for every morph relation', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    await post.related('image').create({ url: 'a.jpg' })
    await post.related('comments').createMany([{ body: 'a' }, { body: 'b' }])
    const comment = await post.related('comments').query().firstOrFail()

    // processRelation (single parent) path, distinct from eager-load over an array.
    await post.load('image')
    await post.load('comments')
    await comment.load('commentable')

    expect(post.image!.url).toBe('a.jpg')
    expect(post.comments).toHaveLength(2)
    expect(comment.commentable).toBeInstanceOf(Post)
  })

  /**
   * ---------------------------------------------------------------------------
   * Serialization
   * ---------------------------------------------------------------------------
   */

  test('serializes preloaded polymorphic relations', async ({ expect }) => {
    const post = await Post.create({ title: 'Post' })
    await post.related('comments').create({ body: 'hi' })

    const loaded = await Post.query().where('id', post.id).preload('comments').firstOrFail()
    const json = loaded.serialize()

    expect(json.comments).toHaveLength(1)
    expect(json.comments[0].body).toBe('hi')
  })
})
