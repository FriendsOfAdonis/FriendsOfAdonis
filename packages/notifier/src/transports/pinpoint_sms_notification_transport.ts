import { SMSMessage } from '../messages/sms_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { PinpointClient, PinpointClientConfig, SendMessagesCommand } from '@aws-sdk/client-pinpoint'

export type PinpointSMSNotificationTransportConfig = {
  applicationId: string
} & PinpointClientConfig

export class PinpointSMSNotificationTransport implements NotificationTransportContract<SMSMessage> {
  #config: PinpointSMSNotificationTransportConfig
  #client: PinpointClient

  constructor(config: PinpointSMSNotificationTransportConfig) {
    this.#config = config
    this.#client = new PinpointClient(config)
  }

  toMessage(notification: Notification, notifiable: NotifiableContract): SMSMessage | undefined {
    if (!notification.toSMS || !notifiable.routeForSMSNotification) return
    return notification.toSMS().to(notifiable.routeForSMSNotification())
  }

  async send(message: SMSMessage): Promise<void> {
    const { to, content } = await message.validate()
    await this.sendMessage(to, content)
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
    routeForSMSNotification?(): string
  }
}
