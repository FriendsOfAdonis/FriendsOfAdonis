import env from '#start/env'
import { defineConfig, transports } from '@foadonis/notifier'

const notifierConfig = defineConfig({
  transports: {
    mail: transports.mail(),
    pinpointSMS: transports.pinpointSMS({
      applicationId: env.get('AWS_PINPOINT_APP_ID'),
      region: env.get('AWS_REGION'),
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    }),
    whatsapp: transports.whatsapp({
      accessToken: env.get('WHATSAPP_ACCESS_TOKEN'),
      phoneId: env.get('WHATSAPP_PHONE_ID'),
    }),
  },
})

export default notifierConfig

declare module '@foadonis/notifier/types' {
  export interface NotificationTransports
    extends InferNotificationTransports<typeof notifierConfig> {}
}
