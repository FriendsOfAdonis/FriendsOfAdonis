import { defineConfig } from '../src/define_config.js'
import { NotifierManager } from '../src/notifier_manager.js'
import { MailNotificationTransport } from '../src/transports/mail_notification_transport.js'
import { PinpointSMSNotificationTransport } from '../src/transports/pinpoint_sms_notification_transport.js'

export const BASE_URL = new URL('./tmp/', import.meta.url)

const config = defineConfig({
  transports: {
    mail: new MailNotificationTransport(null as any),
    sms: new PinpointSMSNotificationTransport(null as any),
  },
})

export function createFakeNotifier() {
  const manager = new NotifierManager({
    transports: {
      mail: new MailNotificationTransport(null as any),
      sms: new PinpointSMSNotificationTransport(null as any),
    },
  })

  const fake = manager.fake()

  return { manager, fake }
}

declare module '@foadonis/notifier/types' {
  export interface NotificationTransports extends InferNotificationTransports<typeof config> {}
}
