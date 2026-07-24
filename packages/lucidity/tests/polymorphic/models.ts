import { BaseModel, column } from '@adonisjs/lucid/orm'
import { type HasMany, type HasOne } from '@adonisjs/lucid/types/relations'
import { morphMany, morphOne, morphTo, type MorphTo } from '../../src/polymorphic/main.ts'

/**
 * Shared model graph used by the polymorphic specs.
 *
 *   posts     : id, title
 *   videos    : id, title                 (static morphType = 'video')
 *   images    : id, url, imageable_*      (morphOne target + morphTo)
 *   comments  : id, body, commentable_*   (morphMany target + morphTo)
 *   tags      : id, name, taggable_*      (morphMany target, no inverse morphTo)
 */

export class Post extends BaseModel {
  static table = 'posts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  // Morph name `imageable` inferred from Image's morphTo.
  @morphOne(() => Image)
  declare image: HasOne<typeof Image> | null

  // Morph name `commentable` inferred from Comment's morphTo.
  @morphMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  // Tag has no inverse morphTo, so the name is passed explicitly.
  @morphMany(() => Tag, 'taggable')
  declare tags: HasMany<typeof Tag>
}

export class Video extends BaseModel {
  static table = 'videos'

  // A stable alias decoupled from the table name.
  static morphType = 'video'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @morphOne(() => Image)
  declare image: HasOne<typeof Image> | null

  @morphMany(() => Comment)
  declare comments: HasMany<typeof Comment>
}

export class Image extends BaseModel {
  static table = 'images'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column()
  declare imageableType: string | null

  @column()
  declare imageableId: number | null

  // Columns `imageableType` / `imageableId` derived from the property name.
  @morphTo(() => [Post, Video])
  declare imageable: MorphTo<[typeof Post, typeof Video]> | null
}

export class Comment extends BaseModel {
  static table = 'comments'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare body: string

  @column()
  declare commentableType: string | null

  @column()
  declare commentableId: number | null

  @morphTo(() => [Post, Video])
  declare commentable: MorphTo<[typeof Post, typeof Video]> | null
}

export class Tag extends BaseModel {
  static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare taggableType: string | null

  @column()
  declare taggableId: number | null
}
