import { ConfigProvider } from '@adonisjs/core/types'
import { Notification } from './notification.js'
import { Notifier } from './notifier.js'
import { NotifiableContract } from './mixins/notifiable.js'

export interface NotificationTransportContract {
  send(notifiable: NotifiableContract, notification: Notification): Promise<void>
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
