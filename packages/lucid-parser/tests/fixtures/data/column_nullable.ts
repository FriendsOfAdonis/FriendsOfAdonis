import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ColumnNullable extends BaseModel {
  @column()
  declare $string: string | null

  @column()
  declare $number: number | null

  @column()
  declare $boolean: boolean | null
}
