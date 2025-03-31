import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ColumnOptional extends BaseModel {
  @column()
  declare $string?: string

  @column()
  declare $number?: number

  @column()
  declare $boolean?: boolean

  @column()
  declare $explicit: boolean | undefined
}
