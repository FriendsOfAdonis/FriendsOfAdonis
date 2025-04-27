import type { NotificationTransports } from './types.js'
import type { NotifiableContract } from './mixins/notifiable.js'

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
    const { default: notifier } = await import('../services/main.js')
    const notification = new this(...args)
    notifier.notify(notifiable, notification)
  }
}
