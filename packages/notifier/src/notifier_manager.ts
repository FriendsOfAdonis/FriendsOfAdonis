import { EmitterLike } from '@adonisjs/core/types/events'
import { NotifierConfig } from './define_config.js'
import { FakeNotifier } from './fake_notifier.js'
import { NotifiableContract } from './mixins/notifiable.js'
import { Notification } from './notification.js'
import { Notifier } from './notifier.js'
import {
  NotificationTransportContract,
  NotificationTransports,
  NotifierContract,
  NotifierEvents,
} from './types.js'

export class NotifierManager<
  KnownTransports extends Record<string, NotificationTransportContract>,
> {
  #notifier: NotifierContract
  #emitter: EmitterLike<NotifierEvents>

  constructor(
    emitter: EmitterLike<NotifierEvents>,
    public config: NotifierConfig<KnownTransports>
  ) {
    this.#emitter = emitter
    this.#notifier = new Notifier(emitter, config)
  }

  async notify(
    notifiable: NotifiableContract,
    notification: Notification,
    channels?: (keyof NotificationTransports)[]
  ) {
    return this.#notifier.notify(notifiable, notification, channels)
  }

  fake(): FakeNotifier<KnownTransports> {
    const notifier = new FakeNotifier(this.#emitter, this.config)
    this.#notifier = notifier
    return notifier
  }

  restore() {
    this.#notifier = new Notifier(this.#emitter, this.config)
  }
}
