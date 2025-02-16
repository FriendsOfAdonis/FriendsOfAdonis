import { NotifiableContract, Notification } from '@foadonis/notifier'
import { NotificationTransportContract } from '../types.js'
import { PushMessage } from '../messages/push_message.js'
import { AppOptions, initializeApp } from 'firebase-admin/app'
import { getMessaging, Messaging } from 'firebase-admin/messaging'

export type FirebasePushNotificationTransportConfig = AppOptions

export class FirebasePushNotificationTransport implements NotificationTransportContract {
  #messaging: Messaging

  constructor(config: FirebasePushNotificationTransportConfig) {
    const app = initializeApp(config)
    this.#messaging = getMessaging(app)
  }

  async send(notifiable: NotifiableContract, notification: Notification): Promise<void> {
    if (!notifiable.routeForPushNotification) return

    const token = notifiable.routeForPushNotification()
    console.log(token)

    if (!token) return

    const res = await this.#messaging.send({
      notification: { title: 'Price drop', body: '5% off all electronics' },
      webpush: {
        fcmOptions: {
          link: 'http://localhost:3333',
        },
      },
      token,
    })

    console.log(res)
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
