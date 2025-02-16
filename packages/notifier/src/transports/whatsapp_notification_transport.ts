import ky from 'ky'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { WhatsAppMessage, WhatsAppMessageContent } from '../messages/whatsapp_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'

export type WhatsAppNotificationTransportConfig = {
  accessToken: string
  phoneId: string
}

export class WhatsAppNotificationTransport implements NotificationTransportContract {
  #config: WhatsAppNotificationTransportConfig

  constructor(config: WhatsAppNotificationTransportConfig) {
    this.#config = config
  }

  async send(notifiable: NotifiableContract, notification: Notification): Promise<void> {
    if (!notification.toWhatsApp) return
    if (!notifiable.routeForSMSNotification) return
    const message = notification.toWhatsApp()
    const to = notifiable.routeForSMSNotification()

    if (!to) return

    if (message.$content?.type === 'text') {
      await this.sendText(to, message.$content.text)
    } else if (message.$content?.type === 'template') {
      await this.sendTemplate(to, message.$content)
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
    routeForSMSNotification?(): string | undefined
  }
}
