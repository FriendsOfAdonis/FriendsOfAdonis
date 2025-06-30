import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ColumnDateTime extends BaseModel {
  @column()
  declare $required: DateTime

  @column()
  declare $optional?: DateTime

  @column()
  declare $nullable: DateTime | null

  @column()
  declare $array: DateTime[]
}
