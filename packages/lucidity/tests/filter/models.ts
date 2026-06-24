import { BaseModel, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { filterScope } from '../../modules/filter/filter.ts'

export class Post extends BaseModel {
  static filter = filterScope<typeof Post>({
    filterable: ['title', 'published'],
    sortable: ['title'],
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare published: boolean

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

export class User extends BaseModel {
  static search = scope((query, value: string) => {
    query.where((q) => {
      q.orWhereLike('firstName', `%${value}%`)
      q.orWhereLike('lastName', `%${value}%`)
    })
  })

  static filter = filterScope<typeof User>({
    filterable: ['firstName', 'lastName', 'email', 'age'],
    sortable: ['firstName', 'age', 'createdAt'],
    relations: {
      posts: Post.filter,
    },
    search: User.search,
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column()
  declare age: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>
}
