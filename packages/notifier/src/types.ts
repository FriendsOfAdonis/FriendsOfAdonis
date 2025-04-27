import { ConfigProvider } from '@adonisjs/core/types'
import { Notification } from './notification.js'
import { Notifier } from './notifier.js'
import { NotifiableContract } from './mixins/notifiable.js'

export interface NotificationTransportContract<TMessage = unknown> {
  toMessage(notification: Notification, notifiable: NotifiableContract): TMessage | undefined
  send(message: TMessage): Promise<void>
}

export interface NotificationTransports {}

export type InferNotificationTransports<
  Config extends ConfigProvider<{
    transports: unknown
  }>,
> = Awaited<ReturnType<Config['resolver']>>['transports']

export interface NotifierService
  extends Notifier<
    NotificationTransports extends Record<string, NotificationTransportContract>
      ? NotificationTransports
      : never
  > {}

export interface NotifierContract {
  notify(
    notifiable: NotifiableContract,
    notification: Notification,
    channels?: (keyof NotificationTransports)[]
  ): Promise<void>
}

export interface NotificationMessenger {}
