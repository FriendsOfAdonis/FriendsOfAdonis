import { BaseModel } from '@adonisjs/lucid/orm'
import { ObjectType, Field, ID } from '@foadonis/graphql'
import { column, table } from '@foadonis/lucidity'
import { DateTime } from 'luxon'

@ObjectType()
@table.index({ columns: ['title', 'description'] })
export default class Recipe extends BaseModel {
  @column.integer({ isPrimary: true })
  @Field(() => ID)
  declare id: string

  @column.varchar()
  @Field()
  declare title: string

  @column.string({ isNullable: true })
  @Field(() => String, { nullable: true })
  declare description: string | null

  @column.json({
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
}
