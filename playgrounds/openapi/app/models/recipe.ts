import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { DateTime } from 'luxon'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  @ApiProperty()
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  declare ingredients: string[]

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
