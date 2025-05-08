import { NotifiableContract } from '../../src/mixins/notifiable.js'
import { Notification } from '../../src/notification.js'

export class FakeNotifiable implements NotifiableContract {
  notify(_notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  routeForMailNotification(): string {
    return 'test@friendsofadonis.com'
  }

  routeForSMSNotification(): string {
    return '+33000000000'
  }
}
