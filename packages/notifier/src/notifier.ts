import { NotifierConfig } from './define_config.js'
import { NotifiableContract } from './mixins/notifiable.js'
import { Notification } from './notification.js'
import { NotificationTransportContract, NotificationTransports } from './types.js'

export class Notifier<KnownTransports extends Record<string, NotificationTransportContract>> {
  constructor(public config: NotifierConfig<KnownTransports>) {}

  async notify(
    notifiable: NotifiableContract,
    notification: Notification,
    channels?: (keyof NotificationTransports)[]
  ) {
    const transports = Object.entries(this.config.transports)

    const userChannels = notifiable.notificationTransports?.() as string[] | undefined

    const promises = transports
      .filter(([name]) => (channels ? (channels as string[]).includes(name) : true))
      .filter(([name]) => (userChannels ? userChannels.includes(name) : true))
      .map(([_, transport]) => transport.send(notifiable, notification))

    await Promise.all(promises)
  }
}
