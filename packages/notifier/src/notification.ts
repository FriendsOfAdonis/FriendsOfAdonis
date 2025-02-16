import { NotificationTransports } from './types.js'
import { NotifiableContract } from './mixins/notifiable.js'
import notifier from '../services/main.js'

export class Notification {
  constructor(..._: any[]) {}

  /**
   * Specify on what channels the notification will be delivered.
   */
  channels(_notifiable: NotifiableContract): (keyof NotificationTransports)[] | void {}

  /**
   * Sends this notification.
   */
  static async notify<T extends typeof Notification>(
    this: T,
    notifiable: NotifiableContract,
    ...args: ConstructorParameters<T>
  ) {
    const notification = new this(...args)
    notifier.notify(notifiable, notification)
  }
}
