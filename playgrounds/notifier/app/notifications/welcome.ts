import { MailMessage, Notification, PushMessage, SMSMessage } from '@foadonis/notifier'

export default class WelcomeNotification extends Notification {
  toMail() {
    return new MailMessage().from('contact@friendsofadonis.com')
  }

  toSMS() {
    return new SMSMessage()
  }

  toPush() {
    return new PushMessage()
  }
}
