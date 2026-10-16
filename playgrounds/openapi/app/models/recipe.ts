import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { DateTime } from 'luxon'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  @ApiProperty()
  declare id: string

  @column()
  @ApiProperty()
  declare title: string

  @column()
  @ApiProperty({ type: 'string', nullable: true })
  declare description: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  @ApiProperty({ type: [String] })
  declare ingredients: string[]

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty()
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  @ApiProperty()
  declare createdAt: DateTime
}
