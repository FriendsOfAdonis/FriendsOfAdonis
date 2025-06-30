import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { Searchable } from '../../src/mixins/searchable.js'
import { DateTime } from 'luxon'
import { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'

export default class User extends compose(BaseModel, Searchable) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ serialize: (value) => (value === 1 ? true : false) })
  declare isAdmin: boolean

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @column.dateTime({ autoCreate: true, serialize: (value: DateTime) => value.toUnixInteger() })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static shouldBeSearchable = false

  shouldBeSearchable(): boolean {
    return User.shouldBeSearchable
  }
}
