import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class WebhookEvent extends BaseModel {
  static table = 'stripe_webhook_events'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare eventId: string

  @column()
  declare eventPayload: Record<string, unknown>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
