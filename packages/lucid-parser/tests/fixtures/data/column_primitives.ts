import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ColumnPrimitives extends BaseModel {
  @column()
  declare $string: string

  @column()
  declare $number: number

  @column()
  declare $boolean: boolean
}
