import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig } from '../src/define_config.js'
import { NotifierManager } from '../src/notifier_manager.js'
import { MailNotificationTransport } from '../src/transports/mail_notification_transport.js'
import { PinpointSMSNotificationTransport } from '../src/transports/pinpoint_sms_notification_transport.js'
import { GenericContainer } from 'testcontainers'
import { LogWaitStrategy } from 'testcontainers/build/wait-strategies/log-wait-strategy.js'

export const BASE_URL = new URL('./tmp/', import.meta.url)

const notifierConfig = defineConfig({
  transports: {
    mail: new MailNotificationTransport(null as any),
    sms: new PinpointSMSNotificationTransport(null as any),
  },
})

export function createFakeNotifier() {
  const manager = new NotifierManager(null as any, {
    transports: {
      mail: new MailNotificationTransport(null as any),
      sms: new PinpointSMSNotificationTransport(null as any),
    },
  })

  const fake = manager.fake()

  return { manager, fake }
}

export const CONTAINERS = {
  mailhog: new GenericContainer('mailhog/mailhog:v1.0.1')
    .withExposedPorts(8025, 1025)
    .withWaitStrategy(new LogWaitStrategy(/Serving under/, 1)),
}

export async function setupApp(
  rcFileContents: Record<string, any> = {},
  config: Record<string, any> = {}
) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents,
      config,
    })
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  return { ace, app }
}

declare module '@foadonis/notifier/types' {
  export interface NotificationTransports
    extends InferNotificationTransports<typeof notifierConfig> {}
}
