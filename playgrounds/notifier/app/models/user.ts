import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Notifiable, NotifiableContract } from '@foadonis/notifier'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User
  extends compose(BaseModel, AuthFinder, Notifiable)
  implements NotifiableContract
{
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare fcmId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  routeForSMS(): string | undefined {
    return '+33606455120'
  }

  routeForMailNotification(): string | undefined {
    return this.email
  }

  routeForPushNotification(): string | undefined {
    return this.fcmId
  }
}
