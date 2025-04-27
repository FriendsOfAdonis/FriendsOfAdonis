import { MailService } from '@adonisjs/mail/types'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { BaseMail, Message } from '@adonisjs/mail'
import { MailMessage } from '../messages/mail_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'

export class MailNotificationTransport implements NotificationTransportContract<MailMessage> {
  #mailer: MailService

  constructor(mailer: MailService) {
    this.#mailer = mailer
  }

  toMessage(notification: Notification, notifiable: NotifiableContract): MailMessage | undefined {
    if (!notification.toMail || !notifiable.routeForMailNotification) return
    return notification.toMail().to(notifiable.routeForMailNotification())
  }

  async send(message: MailMessage): Promise<void> {
    await this.#mailer.send(mailFactory(message))
  }
}

function mailFactory(message: Message) {
  class TestMailMessage extends BaseMail {
    prepare(): void | Promise<void> {
      this.message = message
    }
  }

  return new TestMailMessage()
}

declare module '@foadonis/notifier' {
  interface Notification {
    toMail?(): MailMessage
  }
  interface NotifiableContract {
    routeForMailNotification?(): string
  }
}
