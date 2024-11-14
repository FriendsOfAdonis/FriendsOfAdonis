import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { ApiProperty } from '@foadonis/openapi/decorators'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Recipe from './recipe.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ isPrimary: true })
  @ApiProperty()
  declare id: number

  @column()
  @ApiProperty({ type: String })
  declare fullName: string | null

  @column()
  @ApiProperty()
  declare email: string

  @hasMany(() => Recipe)
  @ApiProperty({ type: Recipe })
  declare recipes: HasMany<typeof Recipe>

  @column({ serializeAs: null })
  @ApiProperty()
  declare password: string

  @column.dateTime({ autoCreate: true })
  @ApiProperty()
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty({ type: String })
  declare updatedAt: DateTime | null
}
