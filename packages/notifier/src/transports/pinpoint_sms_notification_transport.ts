import { SMSMessage } from '../messages/sms_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { PinpointClient, PinpointClientConfig, SendMessagesCommand } from '@aws-sdk/client-pinpoint'

export type PinpointSMSNotificationTransportConfig = {
  applicationId: string
} & PinpointClientConfig

export class PinpointSMSNotificationTransport implements NotificationTransportContract {
  #config: PinpointSMSNotificationTransportConfig
  #client: PinpointClient

  constructor(config: PinpointSMSNotificationTransportConfig) {
    this.#config = config
    this.#client = new PinpointClient(config)
  }

  async send(notifiable: NotifiableContract, notification: Notification): Promise<void> {
    if (!notification.toSMS) return
    if (!notifiable.routeForSMSNotification) return
    const message = notification.toSMS()
    const to = notifiable.routeForSMSNotification()

    if (!to) return
    if (!message.$content) return // TODO: We might want to throw an error

    await this.sendMessage(to, message.$content)
  }

  protected async sendMessage(to: string, content: string) {
    const command = new SendMessagesCommand({
      ApplicationId: this.#config.applicationId,
      MessageRequest: {
        MessageConfiguration: {
          SMSMessage: {
            MessageType: 'TRANSACTIONAL',
            Body: content,
          },
        },
        Addresses: {
          [to]: {
            ChannelType: 'SMS',
          },
        },
      },
    })

    await this.#client.send(command) // TODO: Handle MessageResponse to check for confirmation
  }
}

declare module '@foadonis/notifier' {
  interface Notification {
    wantsJSON(): boolean
  }
}

declare module '@foadonis/notifier' {
  interface Notification {
    toSMS?(): SMSMessage
  }
  interface NotifiableContract {
    routeForSMSNotification?(): string | undefined
  }
}
