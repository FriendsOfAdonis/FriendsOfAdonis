import ky from 'ky'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { WhatsAppMessage, WhatsAppMessageContent } from '../messages/whatsapp_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'

export type WhatsAppNotificationTransportConfig = {
  accessToken: string
  phoneId: string
}

export class WhatsAppNotificationTransport
  implements NotificationTransportContract<WhatsAppMessage>
{
  #config: WhatsAppNotificationTransportConfig

  constructor(config: WhatsAppNotificationTransportConfig) {
    this.#config = config
  }

  toMessage(
    notification: Notification,
    notifiable: NotifiableContract
  ): WhatsAppMessage | undefined {
    if (!notification.toWhatsApp || !notifiable.routeForSMSNotification) return
    return notification.toWhatsApp().to(notifiable.routeForSMSNotification())
  }

  async send(message: WhatsAppMessage): Promise<void> {
    const { content, to } = message.toObject()
    if (!to || !content) return

    if (content.type === 'text') {
      await this.sendText(to, content.text)
    } else if (content.type === 'template') {
      await this.sendTemplate(to, content)
    }
  }

  protected async request(body: any) {
    return ky.post(`https://graph.facebook.com/v21.0/${this.#config.phoneId}/messages`, {
      headers: {
        'Authorization': `Bearer ${this.#config.accessToken}`,
        'Content-Type': 'application/json',
      },
      json: body,
    })
  }

  protected async sendText(to: string, text: string) {
    return this.request({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: text,
      },
    })
  }

  protected async sendTemplate(
    to: string,
    template: WhatsAppMessageContent & { type: 'template' }
  ) {
    return this.request({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template.template.name,
        language: { code: 'en_US' },
      },
    })
  }
}

declare module '@foadonis/notifier' {
  interface Notification {
    toWhatsApp?(): WhatsAppMessage
  }
  interface NotifiableContract {
    routeForSMSNotification?(): string
  }
}
