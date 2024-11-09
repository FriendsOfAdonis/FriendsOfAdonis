import { Field, ObjectType } from '@foadonis/graphql'

@ObjectType()
export class NotificationPayload {
  @Field()
  message: string

  constructor(message: string) {
    this.message = message
  }
}
