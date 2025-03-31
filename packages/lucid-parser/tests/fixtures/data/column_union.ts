import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ColumnUnion extends BaseModel {
  @column()
  declare $nonNull: string | string

  @column()
  declare $complex: string | boolean | number
}
