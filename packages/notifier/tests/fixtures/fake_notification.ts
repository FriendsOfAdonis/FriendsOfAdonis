import { MailMessage } from '../../src/messages/mail_message.js'
import { SMSMessage } from '../../src/messages/sms_message.js'
import { NotifiableContract } from '../../src/mixins/notifiable.js'
import { Notification } from '../../src/notification.js'
import { NotificationTransports } from '../../src/types.js'

export class FakeNotification extends Notification {
  constructor(public fakeData = false) {
    super()
  }

  channels(_notifiable: NotifiableContract): (keyof NotificationTransports)[] | void {
    throw new Error('Method not implemented.')
  }

  toMail(): MailMessage {
    return new MailMessage()
  }

  toSMS(): SMSMessage {
    return new SMSMessage()
  }
}

export class MailFakeNotification extends Notification {
  constructor(public fakeData = false) {
    super()
  }

  channels(_notifiable: NotifiableContract): (keyof NotificationTransports)[] | void {
    throw new Error('Method not implemented.')
  }

  toMail(): MailMessage {
    return new MailMessage()
  }
}

export class SMSFakeNotification extends Notification {
  constructor(public fakeData = false) {
    super()
  }

  channels(_notifiable: NotifiableContract): (keyof NotificationTransports)[] | void {
    throw new Error('Method not implemented.')
  }

  toSMS(): SMSMessage {
    return new SMSMessage()
  }
}
