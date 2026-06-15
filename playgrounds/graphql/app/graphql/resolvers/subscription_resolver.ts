import graphql from '@foadonis/graphql/services/main'
import { Notification } from '#graphql/schemas/notification'
import { NotificationPayload } from '#graphql/schemas/notification_payload'
import stringHelpers from '@adonisjs/core/helpers/string'
import { Mutation, Resolver, Subscription } from 'type-graphql'

@Resolver()
export default class SubscriptionResolver {
  @Subscription({
    topics: 'NOTIFICATIONS',
  })
  newNotification(): Notification {
    return new Notification(new Date(), 'test')
  }

  @Mutation(() => Boolean)
  sendNotification() {
    graphql.pubSub.publish('NOTIFICATIONS', new NotificationPayload(stringHelpers.uuid()))
    return true
  }
}
