import { EmitterLike } from '@adonisjs/core/types/events'
import { NotifierConfig } from './define_config.js'
import { NotifiableContract } from './mixins/notifiable.js'
import { Notification } from './notification.js'
import {
  NotificationTransportContract,
  NotificationTransports,
  NotifierContract,
  NotifierEvents,
} from './types.js'

export class Notifier<KnownTransports extends Record<string, NotificationTransportContract>>
  implements NotifierContract
{
  #emitter: EmitterLike<NotifierEvents>

  constructor(
    emitter: EmitterLike<NotifierEvents>,
    public config: NotifierConfig<KnownTransports>
  ) {
    this.#emitter = emitter
  }

  async notify(
    notifiable: NotifiableContract,
    notification: Notification,
    channels?: (keyof NotificationTransports)[]
  ) {
    const userChannels = notifiable.notificationTransports?.() as string[] | undefined

    const promises = Object.entries(this.config.transports)
      .filter(([name]) => (channels ? (channels as string[]).includes(name) : true))
      .filter(([name]) => (userChannels ? userChannels.includes(name) : true))
      .map(([_, transport]) => this.#notifyRaw(notification, notifiable, transport))

    await Promise.all(promises)
  }

  async #notifyRaw(
    notification: Notification,
    notifiable: NotifiableContract,
    transport: NotificationTransportContract
  ) {
    const message = transport.toMessage(notification, notifiable)

    if (!message) return

    this.#emitter.emit('notifier:notify:before', {
      notification,
      message,
      transport,
      notifiable,
    })

    await transport.send(message)

    this.#emitter.emit('notifier:notify:after', {
      notification,
      message,
      transport,
      notifiable,
    })
  }
}
