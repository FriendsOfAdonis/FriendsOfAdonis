import { type NotificationPayload } from '#graphql/schemas/notification_payload'

declare module '@foadonis/graphql/types' {
  interface PubSubEvents {
    NOTIFICATIONS: [NotificationPayload]
  }
}
