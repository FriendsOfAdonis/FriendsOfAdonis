import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { Notification } from '../notification.js'
import type { NotificationTransports } from '../types.js'

export interface NotifiableContract {
  notify(notification: Notification): Promise<void>
  notificationTransports?(): (keyof NotificationTransports)[] | void
}

export function Notifiable<Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) {
  return class NotifiableModel extends superclass implements NotifiableContract {
    async notify() {
      // TODO: Write this
      console.log('TEST')
    }

    routeForSMS(): string | undefined {
      return this.$getAttribute('phone')
    }
  }
}
