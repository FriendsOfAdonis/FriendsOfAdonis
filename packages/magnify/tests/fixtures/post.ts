import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { Searchable } from '../../src/mixins/searchable.js'
import { DateTime } from 'luxon'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Post extends compose(BaseModel, Searchable) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare authorId: string

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true, serialize: (value: DateTime) => value.toUnixInteger() })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
