import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { column } from '@foadonis/lucidity'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Field, ObjectType } from '@foadonis/graphql'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

@ObjectType()
export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column.increments({ isPrimary: true })
  @Field()
  declare id: number

  @column({ type: 'varchar' })
  declare test: string

  @column.string({ isNullable: true })
  @Field(() => String, { nullable: true })
  declare fullName: string | null

  @column.string({ isNullable: false, isUnique: true, maxLength: 254 })
  @Field()
  declare email: string

  @column({ serializeAs: null })
  @Field()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
