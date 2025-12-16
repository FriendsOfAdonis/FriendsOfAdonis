import pubsub from '#graphql/pubsub'
import { Notification } from '#graphql/schemas/notification'
import { NotificationPayload } from '#graphql/schemas/notification_payload'
import stringHelpers from '@adonisjs/core/helpers/string'
import { Mutation, Resolver, Root, Subscription } from 'type-graphql'

@Resolver()
export default class SubscriptionResolver {
  @Subscription({
    topics: 'NOTIFICATIONS',
  })
  newNotification(@Root() notificationPayload: NotificationPayload): Notification {
    return new Notification(new Date(), 'test')
  }

  @Mutation(() => Boolean)
  sendNotification() {
    pubsub.notification.publish('NOTIFICATIONS', new NotificationPayload(stringHelpers.uuid()))
    return true
  }
}
