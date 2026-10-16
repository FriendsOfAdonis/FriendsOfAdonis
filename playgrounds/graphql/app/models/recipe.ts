import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ObjectType, Field, ID } from '@foadonis/graphql'
import { DateTime } from 'luxon'

@ObjectType()
export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  @Field(() => ID)
  declare id: string

  @column()
  declare expiresIn?: string | number
  declare title: string

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
}
