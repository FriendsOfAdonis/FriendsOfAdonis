import { BaseModel, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ObjectType, Field, ID } from '@foadonis/graphql'
import { column } from '@foadonis/lucidity'
import { DateTime } from 'luxon'
import User from './user.ts'

@ObjectType()
export default class Post extends BaseModel {
  @column.increments({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column.string()
  @Field()
  declare title: string

  @column.integer()
  declare userId: string

  @column.text()
  @Field(() => String, { nullable: true })
  declare description: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  @Field(() => [String])
  declare ingredients: string[]

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @Field()
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  @Field()
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>
}
