import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ObjectType, Field, ID } from '@foadonis/graphql'
import { DateTime } from 'luxon'
import User from './user.ts'

@ObjectType()
export default class Post extends BaseModel {
  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: number

  @column()
  @Field()
  declare title: string

  @column()
  declare userId: string

  @column()
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
