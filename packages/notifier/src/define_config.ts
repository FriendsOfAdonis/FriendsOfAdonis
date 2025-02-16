import { ConfigProvider } from '@adonisjs/core/types'
import type { MailNotificationTransport } from './transports/mail_notification_transport.js'
import { configProvider } from '@adonisjs/core'
import { NotificationTransportContract } from './types.js'
import type {
  PinpointSMSNotificationTransport,
  PinpointSMSNotificationTransportConfig,
} from './transports/pinpoint_sms_notification_transport.js'
import type {
  WhatsAppNotificationTransport,
  WhatsAppNotificationTransportConfig,
} from './transports/whatsapp_notification_transport.js'
import type {
  FirebasePushNotificationTransport,
  FirebasePushNotificationTransportConfig,
} from './transports/firebase_push_notification_transport.js'

export type NotifierConfig<
  KnownTransports extends Record<
    string,
    NotificationTransportContract | ConfigProvider<NotificationTransportContract>
  >,
> = {
  transports: KnownTransports
}

export type ResolvedConfig<
  KnownTransports extends Record<
    string,
    NotificationTransportContract | ConfigProvider<NotificationTransportContract>
  >,
> = {
  transports: KnownTransports
}

export function defineConfig<
  KnownTransports extends Record<
    string,
    NotificationTransportContract | ConfigProvider<NotificationTransportContract>
  >,
>(config: NotifierConfig<KnownTransports>): ConfigProvider<ResolvedConfig<KnownTransports>> {
  return configProvider.create(async (app) => {
    const transports = {} as Record<string, NotificationTransportContract>
    for (const transportName of Object.keys(config.transports)) {
      const transport = config.transports[transportName]
      if (typeof transport === 'function') {
        transports[transportName] = transport
      } else {
        transports[transportName] = await (
          transport as ConfigProvider<NotificationTransportContract>
        ).resolver(app)
      }
    }

    config.transports = transports as any // TODO: Type this

    return config
  })
}

export const transports: {
  mail: () => ConfigProvider<MailNotificationTransport>
  pinpointSMS: (
    config: PinpointSMSNotificationTransportConfig
  ) => ConfigProvider<PinpointSMSNotificationTransport>
  whatsapp: (
    config: WhatsAppNotificationTransportConfig
  ) => ConfigProvider<WhatsAppNotificationTransport>
  firebasePush: (
    config: FirebasePushNotificationTransportConfig
  ) => ConfigProvider<FirebasePushNotificationTransport>
} = {
  mail() {
    return configProvider.create(async () => {
      const { MailNotificationTransport } = await import(
        './transports/mail_notification_transport.js'
      )
      const { default: mailer } = await import('@adonisjs/mail/services/main')
      return new MailNotificationTransport(mailer)
    })
  },
  pinpointSMS(config) {
    return configProvider.create(async () => {
      const { PinpointSMSNotificationTransport } = await import(
        './transports/pinpoint_sms_notification_transport.js'
      )
      return new PinpointSMSNotificationTransport(config)
    })
  },
  whatsapp(config) {
    return configProvider.create(async () => {
      const { WhatsAppNotificationTransport } = await import(
        './transports/whatsapp_notification_transport.js'
      )
      return new WhatsAppNotificationTransport(config)
    })
  },
  firebasePush(config) {
    return configProvider.create(async () => {
      const { FirebasePushNotificationTransport } = await import(
        './transports/firebase_push_notification_transport.js'
      )
      return new FirebasePushNotificationTransport(config)
    })
  },
}
