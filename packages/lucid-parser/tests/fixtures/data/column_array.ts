import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ColumnArray extends BaseModel {
  @column()
  declare $required: string[]

  @column()
  declare $optional?: number[]

  @column()
  declare $nullable: boolean[] | null
}
