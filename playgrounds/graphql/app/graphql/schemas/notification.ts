import { Field, ObjectType } from '@foadonis/graphql'
import { NotificationPayload } from './notification_payload.js'

@ObjectType()
export class Notification extends NotificationPayload {
  @Field()
  date: Date

  constructor(date: Date, message: string) {
    super(message)
    this.date = date
  }
}
