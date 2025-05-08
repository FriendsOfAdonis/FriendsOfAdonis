import { NotifiableContract, Notification } from '@foadonis/notifier'
import { NotificationTransportContract, NotificationTransports } from './types.js'
import { Notifier } from './notifier.js'
import { AssertionError } from 'node:assert'

class FakeMessage<T extends keyof NotificationTransports = keyof NotificationTransports> {
  channel: T
  transport: NotificationTransports[T]
  message: any

  constructor(channel: T, transport: NotificationTransports[T], message: any) {
    this.channel = channel
    this.transport = transport
    this.message = message
  }
}

class FakeNotification<T extends Notification = Notification> {
  notification: T
  notifiable: NotifiableContract

  messages: FakeMessage[]

  constructor(notification: T, notifiable: NotifiableContract, messages: FakeMessage[]) {
    this.notification = notification
    this.notifiable = notifiable
    this.messages = messages
  }

  /**
   * Returns the message sent to the given channel.
   */
  message<TChannel extends keyof NotificationTransports>(channel: TChannel): FakeMessage<TChannel> {
    return this.messages.find((m) => m.channel === channel) as any
  }

  /**
   * Check if this notification has been sent to a specific channel.
   * Optionally you can pass a filtering function to perform checks on the message sent.
   */
  hasChannel<
    TChannel extends keyof NotificationTransports,
    TTransport extends NotificationTransports[TChannel],
    TMessage extends TTransport extends NotificationTransportContract
      ? ReturnType<TTransport['toMessage']>
      : unknown,
  >(channel: TChannel, filter?: (message: NonNullable<TMessage>) => boolean | boolean[]): boolean {
    const message = this.message(channel)

    if (!message) return false
    if (!filter) return Boolean(message)

    return ![filter(message.message)].flat().includes(false)
  }

  /**
   * Returns if the notification is instanceof the provided class.
   */
  isInstanceOf<TClass extends typeof Notification>(notificationClass: TClass): boolean {
    return this.notification instanceof notificationClass
  }

  /**
   * Returns is the notifiable of this notification is the same as the given one.
   */
  hasNotifiable(notifiable: NotifiableContract): boolean {
    return this.notifiable === notifiable
  }
}

export class FakeNotifier<
  KnownTransports extends Record<string, NotificationTransportContract>,
> extends Notifier<KnownTransports> {
  #sent: FakeNotification[] = []

  tackSent(notification: Notification, notifiable: NotifiableContract, messages: FakeMessage[]) {
    this.#sent.push(new FakeNotification(notification, notifiable, messages))
  }

  clear() {
    this.#sent = []
  }

  #filterNotifications<T extends typeof Notification>(
    filter: (notification: FakeNotification<InstanceType<T>>) => boolean | boolean[]
  ) {
    return (notification: FakeNotification<InstanceType<T>>) => {
      if (!filter) return true
      return ![filter(notification)].flat().includes(false)
    }
  }

  sent(filter?: (notification: FakeNotification) => boolean | boolean[]) {
    if (!filter) return this.#sent
    return this.#sent.filter(this.#filterNotifications(filter))
  }

  async notify(
    notifiable: NotifiableContract,
    notification: Notification,
    channels?: (keyof NotificationTransports)[]
  ): Promise<void> {
    const userChannels = notifiable.notificationTransports?.() as string[] | undefined

    const result = Object.entries(this.config.transports)
      .filter(([name]) => (channels ? (channels as string[]).includes(name) : true))
      .filter(([name]) => (userChannels ? userChannels.includes(name) : true))

    const messages = result
      .map(([channel, transport]) => {
        const message = transport.toMessage(notification, notifiable)
        if (!message) return undefined
        return new FakeMessage(channel as keyof NotificationTransports, transport as any, message)
      })
      .filter(Boolean) as FakeMessage[]

    this.tackSent(notification, notifiable, messages)
  }

  assertSent<T extends typeof Notification>(
    notificationClass: T,
    filter?: (notification: FakeNotification<InstanceType<T>>) => boolean | boolean[]
  ) {
    const matching = this.sent((fake) => {
      if (!(fake.notification instanceof notificationClass)) return false
      if (!filter) return true
      return filter(fake as any)
    })

    if (matching.length <= 0) {
      throw new AssertionError({
        message: `Expected notification "${notificationClass.name}" was be sent`,
      })
    }
  }

  assertCount(count: number, filter?: (notification: FakeNotification) => boolean | boolean[]) {
    const matching = this.sent(filter)

    if (matching.length !== count) {
      throw new AssertionError({
        message: `Expected ${count} sent notifications but found ${matching.length}`,
      })
    }
  }

  assertNothingSent() {
    this.assertCount(0)
  }
}
