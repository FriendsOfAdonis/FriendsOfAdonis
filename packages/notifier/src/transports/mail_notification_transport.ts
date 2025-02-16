import { MailService } from '@adonisjs/mail/types'
import { Notification } from '../notification.js'
import { NotificationTransportContract } from '../types.js'
import { BaseMail, Message } from '@adonisjs/mail'
import { MailMessage } from '../messages/mail_message.js'
import { NotifiableContract } from '../mixins/notifiable.js'

export class MailNotificationTransport implements NotificationTransportContract {
  #mailer: MailService

  constructor(mailer: MailService) {
    this.#mailer = mailer
  }

  async send(notifiable: NotifiableContract, notification: Notification): Promise<void> {
    if (!notification.toMail) return
    if (!notifiable.routeForMailNotification) return

    const message = notification.toMail()
    const to = notifiable.routeForMailNotification()

    if (!to) return

    message.to(to)

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
    routeForMailNotification?(): string | undefined
  }
}
