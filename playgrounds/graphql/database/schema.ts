import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class AuthAccessTokenSchema extends BaseModel {
  static $columns = ['id', 'tokenableId', 'type', 'name', 'hash', 'abilities', 'createdAt', 'updatedAt', 'lastUsedAt', 'expiresAt'] as const
  $columns = AuthAccessTokenSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare tokenableId: number
  @column()
  declare type: string
  @column()
  declare name: string | null
  @column()
  declare hash: string
  @column()
  declare abilities: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  @column.dateTime()
  declare lastUsedAt: DateTime | null
  @column.dateTime()
  declare expiresAt: DateTime | null
}

export class PostSchema extends BaseModel {
  static $columns = ['id', 'title', 'description', 'ingredients', 'updatedAt', 'createdAt'] as const
  $columns = PostSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare title: string
  @column()
  declare description: string
  @column()
  declare ingredients: string
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class RecipeSchema extends BaseModel {
  static $columns = ['id', 'title', 'description', 'ingredients', 'updatedAt', 'createdAt'] as const
  $columns = RecipeSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare title: string
  @column()
  declare description: string | null
  @column()
  declare ingredients: any
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

export class UserSchema extends BaseModel {
  static $columns = ['id', 'fullName', 'email', 'password', 'createdAt', 'updatedAt', 'test'] as const
  $columns = UserSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare fullName: string | null
  @column()
  declare email: string
  @column({ serializeAs: null })
  declare password: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column()
  declare test: string
}
