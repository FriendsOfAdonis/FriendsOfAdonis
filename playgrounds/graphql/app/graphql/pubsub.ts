import { createPubSub } from 'graphql-yoga'
import { NotificationPayload } from './schemas/notification_payload.js'

export default {
  notification: createPubSub<{
    NOTIFICATIONS: [NotificationPayload]
  }>(),
}
