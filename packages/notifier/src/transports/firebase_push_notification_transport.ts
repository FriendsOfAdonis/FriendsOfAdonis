import { NotifiableContract, Notification } from '@foadonis/notifier'
import { NotificationTransportContract } from '../types.js'
import { PushMessage } from '../messages/push_message.js'
import { AppOptions, initializeApp } from 'firebase-admin/app'
import { getMessaging, Messaging } from 'firebase-admin/messaging'

export type FirebasePushNotificationTransportConfig = AppOptions

export class FirebasePushNotificationTransport
  implements NotificationTransportContract<PushMessage>
{
  #messaging: Messaging

  constructor(config: FirebasePushNotificationTransportConfig) {
    const app = initializeApp(config)
    this.#messaging = getMessaging(app)
  }

  toMessage(notification: Notification, notifiable: NotifiableContract): PushMessage | undefined {
    if (!notification.toPush || notifiable.routeForPushNotification) return
    return notification.toPush() // TODO: Make push
  }

  async send(message: PushMessage): Promise<void> {
    const { token, title, body, link } = await message.validate()

    await this.#messaging.send({
      notification: { title, body },
      webpush: {
        fcmOptions: {
          link,
        },
      },
      token,
    })
  }
}

declare module '@foadonis/notifier' {
  interface Notification {
    toPush?(): PushMessage
  }
  interface NotifiableContract {
    routeForPushNotification?(): string | undefined
  }
}
